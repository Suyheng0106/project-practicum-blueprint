import { Router } from 'express';
import { prisma } from '../prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticateToken, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

export const candidateRouter = Router();

candidateRouter.use(authenticateToken);
candidateRouter.use(requireRole(Role.CANDIDATE));

// EP-06: Get Candidate Profile
candidateRouter.get('/profile', async (req, res, next) => {
  try {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: req.user!.userId },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        projects: {
          orderBy: { createdAt: 'desc' },
        },
        experiences: {
          orderBy: { startDate: 'desc' },
        },
        achievements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!profile) {
      throw new AppError(404, 'NOT_FOUND', 'Candidate profile has not been created yet.');
    }

    res.status(200).json({
      id: profile.id,
      fullName: profile.fullName,
      bio: profile.bio,
      university: profile.university,
      major: profile.major,
      yearOfStudy: profile.yearOfStudy,
      portfolioUrl: profile.portfolioUrl,
      skills: profile.skills.map((cs) => ({
        id: cs.skill.id,
        name: cs.skill.name,
        category: cs.skill.category,
      })),
      projects: profile.projects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        projectUrl: p.projectUrl,
      })),
      experiences: profile.experiences.map((e) => ({
        id: e.id,
        title: e.title,
        companyName: e.companyName,
        employmentType: e.employmentType,
        location: e.location,
        isCurrent: e.isCurrent,
        startDate: e.startDate.toISOString().split('T')[0],
        endDate: e.endDate ? e.endDate.toISOString().split('T')[0] : null,
        description: e.description,
      })),
      achievements: profile.achievements.map((a) => ({
        id: a.id,
        title: a.title,
        issuer: a.issuer,
        issueDate: a.issueDate ? a.issueDate.toISOString().split('T')[0] : null,
        description: a.description,
        certificateUrl: a.certificateUrl,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// EP-07: Update / Create Candidate Profile
candidateRouter.put('/profile', async (req, res, next) => {
  try {
    const { fullName, bio, university, major, yearOfStudy, portfolioUrl } = req.body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      throw new AppError(400, 'VALIDATION_ERROR', 'Full name is required.');
    }

    const profile = await prisma.candidateProfile.upsert({
      where: { userId: req.user!.userId },
      update: {
        fullName: fullName.trim(),
        bio: bio !== undefined ? bio : undefined,
        university: university !== undefined ? university : undefined,
        major: major !== undefined ? major : undefined,
        yearOfStudy: yearOfStudy !== undefined ? (yearOfStudy ? Number(yearOfStudy) : null) : undefined,
        portfolioUrl: portfolioUrl !== undefined ? portfolioUrl : undefined,
      },
      create: {
        userId: req.user!.userId,
        fullName: fullName.trim(),
        bio,
        university,
        major,
        yearOfStudy: yearOfStudy ? Number(yearOfStudy) : null,
        portfolioUrl,
      },
    });

    res.status(200).json({
      id: profile.id,
      fullName: profile.fullName,
      bio: profile.bio,
      university: profile.university,
      major: profile.major,
      yearOfStudy: profile.yearOfStudy,
      portfolioUrl: profile.portfolioUrl,
      updatedAt: profile.updatedAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// EP-08: Update Candidate Skills
candidateRouter.put('/skills', async (req, res, next) => {
  try {
    const { skillIds } = req.body;

    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Please select at least one skill.');
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!profile) {
      throw new AppError(404, 'NOT_FOUND', 'Candidate profile does not exist yet.');
    }

    // Verify all skills exist
    const validSkills = await prisma.skill.findMany({
      where: { id: { in: skillIds } },
    });

    if (validSkills.length !== skillIds.length) {
      throw new AppError(400, 'VALIDATION_ERROR', 'One or more skill IDs are invalid.');
    }

    // Replace candidate skills in transaction
    await prisma.$transaction([
      prisma.candidateSkill.deleteMany({
        where: { candidateProfileId: profile.id },
      }),
      prisma.candidateSkill.createMany({
        data: skillIds.map((sId: string) => ({
          candidateProfileId: profile.id,
          skillId: sId,
        })),
      }),
    ]);

    const updated = await prisma.candidateSkill.findMany({
      where: { candidateProfileId: profile.id },
      include: { skill: true },
    });

    res.status(200).json({
      candidateProfileId: profile.id,
      skills: updated.map((cs) => ({
        id: cs.skill.id,
        name: cs.skill.name,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// EP-09: Add Candidate Project
candidateRouter.post('/projects', async (req, res, next) => {
  try {
    const { title, description, projectUrl } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new AppError(400, 'VALIDATION_ERROR', 'Project title is required.');
    }

    if (title.length > 150) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Project title cannot exceed 150 characters.');
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!profile) {
      throw new AppError(404, 'NOT_FOUND', 'Candidate profile does not exist.');
    }

    const project = await prisma.candidateProject.create({
      data: {
        candidateProfileId: profile.id,
        title: title.trim(),
        description: description || null,
        projectUrl: projectUrl || null,
      },
    });

    res.status(201).json({
      id: project.id,
      candidateProfileId: project.candidateProfileId,
      title: project.title,
      description: project.description,
      projectUrl: project.projectUrl,
      createdAt: project.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// EP-13: List Saved Jobs
candidateRouter.get('/saved-jobs', async (req, res, next) => {
  try {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!profile) {
      throw new AppError(404, 'NOT_FOUND', 'Candidate profile not found.');
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: { candidateProfileId: profile.id },
      orderBy: { createdAt: 'desc' },
      include: {
        jobListing: {
          include: {
            company: true,
          },
        },
      },
    });

    res.status(200).json(
      savedJobs.map((sj) => ({
        savedAt: sj.createdAt.toISOString(),
        job: {
          id: sj.jobListing.id,
          title: sj.jobListing.title,
          company: sj.jobListing.company.name,
          location: sj.jobListing.location,
        },
      }))
    );
  } catch (err) {
    next(err);
  }
});

// EP-17: List Candidate Applications
candidateRouter.get('/applications', async (req, res, next) => {
  try {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!profile) {
      throw new AppError(404, 'NOT_FOUND', 'Candidate profile not found.');
    }

    const applications = await prisma.jobApplication.findMany({
      where: { candidateProfileId: profile.id },
      orderBy: { createdAt: 'desc' },
      include: {
        jobListing: {
          include: {
            company: true,
          },
        },
      },
    });

    res.status(200).json(
      applications.map((app) => ({
        id: app.id,
        job: {
          id: app.jobListing.id,
          title: app.jobListing.title,
          company: app.jobListing.company.name,
        },
        matchScore: app.matchScore,
        status: app.status,
        appliedAt: app.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    next(err);
  }
});

// EP-23: List Preparation Guides tailored to Candidate
candidateRouter.get('/guides', async (req, res, next) => {
  try {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!profile) {
      throw new AppError(404, 'NOT_FOUND', 'Candidate profile does not exist.');
    }

    const { skillId, category } = req.query;

    const whereClause: any = {};
    if (category && typeof category === 'string') {
      whereClause.category = category;
    }
    if (skillId && typeof skillId === 'string') {
      whereClause.skills = {
        some: {
          skillId: skillId,
        },
      };
    }

    const guides = await prisma.preparationGuide.findMany({
      where: whereClause,
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(
      guides.map((g) => ({
        id: g.id,
        title: g.title,
        category: g.category,
        summary: g.summary,
        content: g.content,
        skills: g.skills.map((s) => ({
          id: s.skill.id,
          name: s.skill.name,
        })),
      }))
    );
  } catch (err) {
    next(err);
  }
});
