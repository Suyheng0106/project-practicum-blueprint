import { PrismaClient, Role, EmploymentType, WorkExperienceType, JobStatus, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with clean initial data...');

  // Clear existing data in reverse dependency order
  await prisma.preparationGuideSkill.deleteMany();
  await prisma.preparationGuide.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobRequiredSkill.deleteMany();
  await prisma.jobListing.deleteMany();
  await prisma.company.deleteMany();
  await prisma.candidateSkill.deleteMany();
  await prisma.candidateAchievement.deleteMany();
  await prisma.candidateExperience.deleteMany();
  await prisma.candidateProject.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Seed Skills Catalog
  console.log('Seeding technical skills taxonomy...');
  const skillData = [
    { name: 'Flutter', category: 'Mobile' },
    { name: 'React Native', category: 'Mobile' },
    { name: 'Swift', category: 'Mobile' },
    { name: 'Kotlin', category: 'Mobile' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'HTML/CSS', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'FastAPI', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Git', category: 'General' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Linux', category: 'DevOps' },
    { name: 'Jest', category: 'QA' },
  ];

  const skillMap = new Map<string, string>();
  for (const s of skillData) {
    const created = await prisma.skill.create({ data: s });
    skillMap.set(s.name, created.id);
  }

  // 2. Seed Users
  console.log('Seeding demo accounts...');
  // Candidate: Sokha
  const candidateUser = await prisma.user.create({
    data: {
      email: 'sokha.pech@it.edu.kh',
      passwordHash,
      role: Role.CANDIDATE,
    },
  });

  // Employer: Dara
  const employerUser = await prisma.user.create({
    data: {
      email: 'dara.recruiter@techbridge.kh',
      passwordHash,
      role: Role.EMPLOYER,
    },
  });

  // 3. Seed Candidate Profile (Sokha)
  console.log('Seeding Sokha candidate profile...');
  const candidateProfile = await prisma.candidateProfile.create({
    data: {
      userId: candidateUser.id,
      fullName: 'Sokha Pech',
      bio: 'IT candidate passionate about Flutter and backend engineering.',
      university: 'Royal University of Phnom Penh',
      major: 'Computer Science',
      yearOfStudy: 3,
      portfolioUrl: 'https://github.com/sokhapech',
    },
  });

  // Candidate Skills: Flutter, Git, TypeScript
  const sokhaSkills = ['Flutter', 'Git', 'TypeScript'];
  for (const skillName of sokhaSkills) {
    const skillId = skillMap.get(skillName);
    if (skillId) {
      await prisma.candidateSkill.create({
        data: {
          candidateProfileId: candidateProfile.id,
          skillId,
        },
      });
    }
  }

  // Candidate Project
  await prisma.candidateProject.create({
    data: {
      candidateProfileId: candidateProfile.id,
      title: 'E-Commerce Mobile App',
      description: 'Candidate group capstone project built with Flutter and REST APIs.',
      projectUrl: 'https://github.com/sokhapech/shop',
    },
  });

  // Candidate Experience
  await prisma.candidateExperience.create({
    data: {
      candidateProfileId: candidateProfile.id,
      title: 'Junior Web Developer Intern',
      companyName: 'TechStart Solutions',
      employmentType: WorkExperienceType.INTERNSHIP,
      location: 'Phnom Penh',
      isCurrent: false,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-09-01'),
      description: 'Assisted in building responsive frontend modules with React and TypeScript.',
    },
  });

  // Candidate Achievement
  await prisma.candidateAchievement.create({
    data: {
      candidateProfileId: candidateProfile.id,
      title: '1st Place - University Hackathon',
      issuer: 'RUPP Tech Fair',
      issueDate: new Date('2025-10-15'),
      description: 'Built an automated student portal in 24 hours.',
      certificateUrl: 'https://certificates.example.com/ach001',
    },
  });

  // 4. Seed Employer Company (TechBridge Solutions)
  console.log('Seeding company and job listings...');
  const company = await prisma.company.create({
    data: {
      userId: employerUser.id,
      name: 'TechBridge Solutions',
      industry: 'Software Development',
      location: 'Phnom Penh, Cambodia',
      website: 'https://techbridge.kh',
      description: 'Leading tech company providing digital and software solutions.',
      logoUrl: 'https://via.placeholder.com/150',
    },
  });

  // Job Listing 1: Junior Flutter Developer Intern (Required: Flutter, Git, Docker)
  // Note: Sokha matches Flutter & Git (2/3 = 67%), missing Docker (skill gap!)
  const job1 = await prisma.jobListing.create({
    data: {
      companyId: company.id,
      title: 'Junior Flutter Developer Intern',
      description: 'Great internship opportunity for IT candidates to build mobile apps in Flutter. You will collaborate with senior engineers to deliver user interfaces and consume REST APIs.',
      category: 'Mobile Development',
      employmentType: EmploymentType.INTERNSHIP,
      location: 'Phnom Penh',
      isRemote: false,
      stipendAmountCents: 25000, // $250.00 / month
      status: JobStatus.OPEN,
    },
  });

  for (const sName of ['Flutter', 'Git', 'Docker']) {
    const sId = skillMap.get(sName);
    if (sId) {
      await prisma.jobRequiredSkill.create({
        data: {
          jobListingId: job1.id,
          skillId: sId,
        },
      });
    }
  }

  // Job Listing 2: Junior Backend Developer (Required: Node.js, TypeScript, PostgreSQL, Docker)
  const job2 = await prisma.jobListing.create({
    data: {
      companyId: company.id,
      title: 'Junior Backend Developer',
      description: 'Seeking an enthusiastic entry-level backend engineer with TypeScript and Node.js knowledge. You will build and optimize database queries and RESTful services.',
      category: 'Backend',
      employmentType: EmploymentType.ENTRY_LEVEL,
      location: 'Phnom Penh',
      isRemote: true,
      stipendAmountCents: 35000, // $350.00 / month
      status: JobStatus.OPEN,
    },
  });

  for (const sName of ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker']) {
    const sId = skillMap.get(sName);
    if (sId) {
      await prisma.jobRequiredSkill.create({
        data: {
          jobListingId: job2.id,
          skillId: sId,
        },
      });
    }
  }

  // Job Listing 3: Frontend Developer Intern (Required: TypeScript, React, HTML/CSS, Git)
  const job3 = await prisma.jobListing.create({
    data: {
      companyId: company.id,
      title: 'Frontend Developer Intern',
      description: 'Join our web team to create responsive interfaces using modern React and TypeScript. Perfect for IT students looking to apply their frontend skills.',
      category: 'Frontend',
      employmentType: EmploymentType.INTERNSHIP,
      location: 'Phnom Penh',
      isRemote: false,
      stipendAmountCents: 20000, // $200.00 / month
      status: JobStatus.OPEN,
    },
  });

  for (const sName of ['TypeScript', 'React', 'HTML/CSS', 'Git']) {
    const sId = skillMap.get(sName);
    if (sId) {
      await prisma.jobRequiredSkill.create({
        data: {
          jobListingId: job3.id,
          skillId: sId,
        },
      });
    }
  }

  // 5. Seed Preparation Guides with Many-to-Many Skill Links
  console.log('Seeding preparation guides and guide skills...');
  const guidesData = [
    {
      title: 'Docker Essentials for Junior Backend Roles',
      category: 'DevOps & Cloud',
      summary: 'Step-by-step introduction to Docker containers, images, and docker-compose for junior developers.',
      content: '## Docker Essentials\nContainers isolate application dependencies from host systems. When building microservices or APIs with Node.js and PostgreSQL, Docker guarantees consistent runtime environments across local development and production.\n\n### Key Concepts\n- **Dockerfile**: Blueprint for your image.\n- **Image**: Immutable snapshot of your app.\n- **Container**: Running instance of an image.\n- **docker-compose**: Tool for defining multi-container applications.',
      skills: ['Docker'],
    },
    {
      title: 'Structuring a Clean Architecture Flutter App',
      category: 'Mobile Development',
      summary: 'Learn how to organize Flutter folders, models, controllers, and services for production-grade apps.',
      content: '## Clean Architecture in Flutter\nOrganizing code into domain, data, and presentation layers prevents spaghetti code. Keep business logic outside of UI widgets using providers or Bloc patterns.\n\n### Folder Guidelines\n- `core/`: Constants, themes, and network clients.\n- `features/`: Module-based folders containing presentation and data layers.\n- `shared/`: Reusable widgets and UI elements.',
      skills: ['Flutter', 'Git'],
    },
    {
      title: 'Git Branching & Pull Request Etiquette',
      category: 'Portfolio Guides',
      summary: 'How to maintain clean git commits, write PR descriptions, and collaborate on tech teams.',
      content: '## Collaborative Git Workflows\nEmployers value candidates who write atomic commits and understandable pull requests.\n\n### Best Practices\n1. Follow conventional commit messages (`feat:`, `fix:`, `refactor:`).\n2. Create feature branches from `main` or `develop`.\n3. Always rebase or pull before submitting a pull request to resolve conflicts early.',
      skills: ['Git'],
    },
    {
      title: 'Modern TypeScript Patterns for Junior Devs',
      category: 'Frontend',
      summary: 'Essential TypeScript features: interfaces, types, generics, and strict null checks explained simply.',
      content: '## Writing Safe TypeScript\nTypeScript adds static typing to JavaScript, catching type mismatches at compile time rather than runtime.\n\n### Key Patterns\n- Favor `interface` for public API contracts and object shapes.\n- Use `type` for unions and primitives.\n- Enable `strict: true` in `tsconfig.json` for maximum type safety.',
      skills: ['TypeScript'],
    },
    {
      title: 'How to Structure an IT Internship Portfolio',
      category: 'Portfolio Guides',
      summary: 'Step-by-step tips for candidates showcasing coding projects and GitHub repositories to employers.',
      content: '## Building Your First Portfolio\nWhen applying for your first software job, recruiters look for evidence of problem solving.\n\n1. Host at least two polished, working projects with live demo links.\n2. Write clear README files with setup instructions, architecture diagrams, and tech stack badges.\n3. Show consistent commit history demonstrating steady learning.',
      skills: ['Git'],
    },
    {
      title: 'A Beginner’s Guide to Technical Coding Interviews',
      category: 'Interview Tips',
      summary: 'How to approach algorithm challenges, communicate thought processes, and answer system design basics.',
      content: '## Nailing Technical Interviews\nInterviewers care more about your problem-solving process than memorizing syntax.\n\n- Clarify constraints before writing code.\n- Talk through edge cases (empty inputs, nulls, high volume).\n- Test your code step-by-step with a sample trace.',
      skills: ['Node.js'],
    },
  ];

  for (const g of guidesData) {
    const guide = await prisma.preparationGuide.create({
      data: {
        title: g.title,
        category: g.category,
        summary: g.summary,
        content: g.content,
      },
    });

    for (const skillName of g.skills) {
      const skillId = skillMap.get(skillName);
      if (skillId) {
        await prisma.preparationGuideSkill.create({
          data: {
            preparationGuideId: guide.id,
            skillId,
          },
        });
      }
    }
  }

  // 6. Seed Sample Application & Saved Job
  console.log('Seeding initial application and saved job for Sokha...');
  // Sokha applied to Job 1 (Junior Flutter Developer Intern), match_score: 67
  await prisma.jobApplication.create({
    data: {
      candidateProfileId: candidateProfile.id,
      jobListingId: job1.id,
      matchScore: 67,
      status: ApplicationStatus.SUBMITTED,
    },
  });

  // Sokha saved Job 2 (Junior Backend Developer)
  await prisma.savedJob.create({
    data: {
      candidateProfileId: candidateProfile.id,
      jobListingId: job2.id,
    },
  });

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
