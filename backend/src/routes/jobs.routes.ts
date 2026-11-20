import { Router } from 'express';
import { prisma } from '../prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticateToken, requireRole } from '../middleware/auth';
import { Role, ApplicationStatus, JobStatus } from '@prisma/client';

export const jobsRouter = Router();

// EP-10: Browse Curated Beginner Jobs
jobsRouter.get('/', async (req, res, next) => {
  try {
    const { category, employmentType, search } = req.query;

    const where: any = {
      status: JobStatus.OPEN,
    };

    if (category && typeof category === 'string') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (employmentType && typeof employmentType === 'string') {
      where.employmentType = employmentType;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        {
          requiredSkills: {
            some: {
              skill: {
                name: { contains: q, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    const jobs = await prisma.jobListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
        requiredSkills: {
          include: {
            skill: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      total: jobs.length,
      jobs: jobs.map((j) => ({
        id: j.id,
        title: j.title,
        category: j.category,
        employmentType: j.employmentType,
        location: j.location,
        isRemote: j.isRemote,
        stipendAmountCents: j.stipendAmountCents,
        company: {
          id: j.company.id,
          name: j.company.name,
          logoUrl: j.company.logoUrl,
        },
        requiredSkills: j.requiredSkills.map((rs) => ({
          id: rs.skill.id,
          name: rs.skill.name,
        })),
        createdAt: j.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
});

// EP-11: Job Details
jobsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.jobListing.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            website: true,
            description: true,
            logoUrl: true,
          },
        },
        requiredSkills: {
          include: {
            skill: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      throw new AppError(404, 'NOT_FOUND', 'The requested job listing was not found.');
    }

    res.status(200).json({
      id: job.id,
      title: job.title,
      description: job.description,
      category: job.category,
      employmentType: job.employmentType,
      location: job.location,
      isRemote: job.isRemote,
      stipendAmountCents: job.stipendAmountCents,
      status: job.status,
      company: {
        id: job.company.id,
        name: job.company.name,
        website: job.company.website,
        description: job.company.description,
        logoUrl: job.company.logoUrl,
      },
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

// EP-12: Run Skill Gap Analysis (Candidate Only)
jobsRouter.get('/:id/fit', authenticateToken, requireRole(Role.CANDIDATE), async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.jobListing.findUnique({
      where: { id },
      include: {
        requiredSkills: {
          include: { skill: true },
        },
      },
    });

    if (!job) {
      throw new AppError(404, 'NOT_FOUND', 'Target job listing does not exist.');
    }

    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: req.user!.userId },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });

    if (!candidateProfile || candidateProfile.skills.length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Please add skills to your profile first.');
    }

    const candidateSkillIds = new Set(candidateProfile.skills.map((cs) => cs.skillId));

    const matchingSkills: { id: string; name: string }[] = [];
    const missingSkills: { id: string; name: string }[] = [];

    for (const rs of job.requiredSkills) {
      if (candidateSkillIds.has(rs.skillId)) {
        matchingSkills.push({ id: rs.skill.id, name: rs.skill.name });
      } else {
        missingSkills.push({ id: rs.skill.id, name: rs.skill.name });
      }
    }

    const totalRequired = job.requiredSkills.length;
    const matchScore = totalRequired === 0 ? 100 : Math.round((matchingSkills.length / totalRequired) * 100);

    res.status(200).json({
      jobId: job.id,
      jobTitle: job.title,
      matchScore,
      totalRequired,
      matchedCount: matchingSkills.length,
      matchingSkills,
      missingSkills,
    });
  } catch (err) {
    next(err);
  }
});

// EP-14: Save Job Listing (Candidate Only)
jobsRouter.post('/:id/save', authenticateToken, requireRole(Role.CANDIDATE), async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.jobListing.findUnique({ where: { id } });
    if (!job) {
      throw new AppError(404, 'NOT_FOUND', 'Job listing does not exist.');
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!profile) {
      throw new AppError(404, 'NOT_FOUND', 'Candidate profile does not exist.');
    }

    const existing = await prisma.savedJob.findUnique({
      where: {
        candidateProfileId_jobListingId: {
          candidateProfileId: profile.id,
          jobListingId: id,
        },
      },
    });

    if (existing) {
      throw new AppError(409, 'CONFLICT', 'Job is already saved.');
    }

    const saved = await prisma.savedJob.create({
      data: {
        candidateProfileId: profile.id,
        jobListingId: id,
      },
    });

    res.status(201).json({
      jobListingId: saved.jobListingId,
      status: 'SAVED',
      savedAt: saved.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// EP-15: Unsave Job Listing (Candidate Only)
jobsRouter.delete('/:id/save', authenticateToken, requireRole(Role.CANDIDATE), async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!profile) {
      throw new AppError(404, 'NOT_FOUND', 'Candidate profile does not exist.');
    }

    const existing = await prisma.savedJob.findUnique({
      where: {
        candidateProfileId_jobListingId: {
          candidateProfileId: profile.id,
          jobListingId: id,
        },
      },
    });

    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'Job was not previously saved.');
    }

    await prisma.savedJob.delete({
      where: { id: existing.id },
    });

    res.status(200).json({
      jobListingId: id,
      status: 'REMOVED',
    });
  } catch (err) {
    next(err);
  }
});

// EP-16: Apply to Job Listing (Candidate Only)
jobsRouter.post('/:id/apply', authenticateToken, requireRole(Role.CANDIDATE), async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.jobListing.findUnique({
      where: { id },
      include: {
        requiredSkills: true,
      },
    });

    if (!job || job.status === JobStatus.CLOSED) {
      throw new AppError(404, 'NOT_FOUND', 'Job listing does not exist or has closed.');
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: req.user!.userId },
      include: {
        skills: true,
      },
    });

    if (!profile) {
      throw new AppError(404, 'NOT_FOUND', 'Candidate profile does not exist.');
    }

    if (profile.skills.length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Please add skills to your profile first.');
    }

    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        jobListingId_candidateProfileId: {
          jobListingId: id,
          candidateProfileId: profile.id,
        },
      },
    });

    if (existingApplication) {
      throw new AppError(409, 'CONFLICT', 'Candidate has already applied to this job listing.');
    }

    // Calculate match score
    const candidateSkillIds = new Set(profile.skills.map((s) => s.skillId));
    const matchedCount = job.requiredSkills.filter((rs) => candidateSkillIds.has(rs.skillId)).length;
    const totalRequired = job.requiredSkills.length;
    const matchScore = totalRequired === 0 ? 100 : Math.round((matchedCount / totalRequired) * 100);

    const application = await prisma.jobApplication.create({
      data: {
        jobListingId: id,
        candidateProfileId: profile.id,
        matchScore,
        status: ApplicationStatus.SUBMITTED,
      },
    });

    res.status(201).json({
      id: application.id,
      jobListingId: application.jobListingId,
      candidateProfileId: application.candidateProfileId,
      matchScore: application.matchScore,
      status: application.status,
      appliedAt: application.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});
