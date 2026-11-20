import { Router } from 'express';
import { prisma } from '../prisma';

export const skillsRouter = Router();

// EP-05: List Skills Taxonomy
skillsRouter.get('/', async (req, res, next) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        category: true,
      },
    });

    res.status(200).json(skills);
  } catch (err) {
    next(err);
  }
});
