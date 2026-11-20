import { Router } from 'express';
import { prisma } from '../prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticateToken, requireRole } from '../middleware/auth';
import { Role, ApplicationStatus, EmploymentType } from '@prisma/client';

export const employerRouter = Router();

employerRouter.use(authenticateToken);
employerRouter.use(requireRole(Role.EMPLOYER));

// EP-18: Create or Update Company Profile
employerRouter.post('/company', async (req, res, next) => {
  try {
    const { name, industry, location, website, description, logoUrl } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new AppError(400, 'VALIDATION_ERROR', 'Company name is required.');
    }

    const existing = await prisma.company.findFirst({
      where: { userId: req.user!.userId },
    });

    let company;
    if (existing) {
      company = await prisma.company.update({
        where: { id: existing.id },
        data: {
          name: name.trim(),
          industry: industry !== undefined ? industry : undefined,
          location: location !== undefined ? location : undefined,
          website: website !== undefined ? website : undefined,
          description: description !== undefined ? description : undefined,
          logoUrl: logoUrl !== undefined ? logoUrl : undefined,
        },
      });
    } else {
      company = await prisma.company.create({
        data: {
          userId: req.user!.userId,
          name: name.trim(),
          industry: industry || null,
          location: location || null,
          website: website || null,
          description: description || null,
          logoUrl: logoUrl || null,
        },
      });
    }

    res.status(200).json({
      id: company.id,
      name: company.name,
      industry: company.industry,
      location: company.location,
      website: company.website,
      description: company.description,
      updatedAt: company.updatedAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// EP-19: List Employer Job Postings
employerRouter.get('/jobs', async (req, res, next) => {
  try {
    const company = await prisma.company.findFirst({
      where: { userId: req.user!.userId },
    });

    if (!company) {
      throw new AppError(404, 'NOT_FOUND', 'Recruiter has not set up a company profile.');
    }

    const jobs = await prisma.jobListing.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    res.status(200).json(
      jobs.map((j) => ({
        id: j.id,
        title: j.title,
        status: j.status,
        applicantCount: j._count.applications,
        createdAt: j.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    next(err);
  }
});

// EP-20: Publish Entry-Level Job Listing
employerRouter.post('/jobs', async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      employmentType,
      location,
      isRemote,
      stipendAmountCents,
      requiredSkillIds,
    } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new AppError(400, 'VALIDATION_ERROR', 'Job title is required.');
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      throw new AppError(400, 'VALIDATION_ERROR', 'A comprehensive description (minimum 10 characters) is required.');
    }

    if (!Array.isArray(requiredSkillIds) || requiredSkillIds.length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Please select at least one required skill.');
    }

    const company = await prisma.company.findFirst({
      where: { userId: req.user!.userId },
    });

    if (!company) {
      throw new AppError(404, 'NOT_FOUND', 'Recruiter company profile has not been created yet.');
    }

    // Verify skills exist
    const skills = await prisma.skill.findMany({
      where: { id: { in: requiredSkillIds } },
    });

    if (skills.length !== requiredSkillIds.length) {
      throw new AppError(400, 'VALIDATION_ERROR', 'One or more required skill IDs are invalid.');
    }

    const validEmploymentType =
      employmentType && Object.values(EmploymentType).includes(employmentType as EmploymentType)
        ? (employmentType as EmploymentType)
        : EmploymentType.INTERNSHIP;

    const job = await prisma.jobListing.create({
      data: {
        companyId: company.id,
        title: title.trim(),
        description: description.trim(),
        category: category || 'Software Engineering',
        employmentType: validEmploymentType,
        location: location || 'Phnom Penh',
        isRemote: Boolean(isRemote),
        stipendAmountCents: stipendAmountCents !== undefined ? Number(stipendAmountCents) : null,
        requiredSkills: {
          create: requiredSkillIds.map((sId: string) => ({
            skillId: sId,
          })),
        },
      },
      include: {
        requiredSkills: {
          include: { skill: true },
        },
      },
    });

    res.status(201).json({
      id: job.id,
      title: job.title,
      status: job.status,
      companyId: job.companyId,
      requiredSkills: job.requiredSkills.map((rs) => ({
        id: rs.skill.id,
        name: rs.skill.name,
      })),
      createdAt: job.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// EP-21: Review Job Applicants
employerRouter.get('/jobs/:id/applications', async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.jobListing.findUnique({
      where: { id },
      include: {
        company: true,
        requiredSkills: {
          include: { skill: true },
        },
      },
    });

    if (!job) {
      throw new AppError(404, 'NOT_FOUND', 'Job listing not found.');
    }

    if (job.company.userId !== req.user!.userId) {
      throw new AppError(403, 'FORBIDDEN', 'Job listing does not belong to your company.');
    }

    const applications = await prisma.jobApplication.findMany({
      where: { jobListingId: id },
      orderBy: { matchScore: 'desc' },
      include: {
        candidateProfile: {
          include: {
            skills: {
              include: { skill: true },
            },
          },
        },
      },
    });

    const jobSkillIds = new Set(job.requiredSkills.map((rs) => rs.skillId));

    res.status(200).json(
      applications.map((app) => {
        const candidateSkillIds = new Set(app.candidateProfile.skills.map((cs) => cs.skillId));
        const matchingSkills = job.requiredSkills
          .filter((rs) => candidateSkillIds.has(rs.skillId))
          .map((rs) => rs.skill.name);
        const missingSkills = job.requiredSkills
          .filter((rs) => !candidateSkillIds.has(rs.skillId))
          .map((rs) => rs.skill.name);

        return {
          id: app.id,
          matchScore: app.matchScore,
          status: app.status,
          appliedAt: app.createdAt.toISOString(),
          candidateProfile: {
            fullName: app.candidateProfile.fullName,
            university: app.candidateProfile.university,
            major: app.candidateProfile.major,
            yearOfStudy: app.candidateProfile.yearOfStudy,
            portfolioUrl: app.candidateProfile.portfolioUrl,
            matchingSkills,
            missingSkills,
          },
        };
      })
    );
  } catch (err) {
    next(err);
  }
});

// EP-22: Update Applicant Status
employerRouter.patch('/applications/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'Valid status is required (SUBMITTED, UNDER_REVIEW, ACCEPTED, REJECTED).'
      );
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        jobListing: {
          include: { company: true },
        },
      },
    });

    if (!application) {
      throw new AppError(404, 'NOT_FOUND', 'Application ID not found.');
    }

    if (application.jobListing.company.userId !== req.user!.userId) {
      throw new AppError(403, 'FORBIDDEN', 'Application belongs to a job owned by another company.');
    }

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: { status: status as ApplicationStatus },
    });

    res.status(200).json({
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});
