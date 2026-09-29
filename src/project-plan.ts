import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

export const ProjectPlanInputSchema = z.object({
  profile: z.string().min(10).describe('Formação, experiência e momento atual da pessoa'),
  objective: z.string().min(5).describe('O que a pessoa quer demonstrar com o projeto'),
  interests: z.array(z.string().min(2)).min(1).describe('Temas de interesse para o projeto'),
  knownTechnologies: z
    .array(z.string().min(1))
    .describe('Tecnologias que a pessoa já conhece'),
  availableWeeks: z.number().int().min(1).max(52).describe('Prazo total em semanas'),
  weeklyHours: z.number().int().min(1).max(80).describe('Horas disponíveis por semana'),
});

export const ProjectPlanSchema = z.object({
  title: z.string(),
  elevatorPitch: z.string(),
  problem: z.string(),
  targetAudience: z.string(),
  portfolioValue: z.string(),
  features: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      priority: z.enum(['essencial', 'complementar']),
    }),
  ),
  technologyStack: z.array(
    z.object({
      name: z.string(),
      reason: z.string(),
    }),
  ),
  milestones: z.array(
    z.object({
      title: z.string(),
      durationWeeks: z.number().int().positive(),
      outcome: z.string(),
      tasks: z.array(z.string()),
    }),
  ),
  caseStudySections: z.array(z.string()),
});

const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', {
    temperature: 0.7,
  }),
});

export const projectPortfolioPlanFlow = ai.defineFlow(
  {
    name: 'projectPortfolioPlanFlow',
    inputSchema: ProjectPlanInputSchema,
    outputSchema: ProjectPlanSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `Crie em português brasileiro um plano de projeto web original para portfólio.

Use os dados abaixo como contexto e restrições. Não afirme que a pessoa possui habilidades que não listou. Recomende tecnologias com justificativas, priorize um MVP executável e distribua as etapas dentro do prazo e da disponibilidade semanal informados. Diferencie funcionalidades essenciais das complementares. Evite propostas genéricas e explique o valor do projeto para um recrutador ou cliente.

Dados da pessoa:
${JSON.stringify(input, null, 2)}`,
      output: { schema: ProjectPlanSchema },
    });

    if (!output) throw new Error('O Gemini não retornou um plano de projeto.');

    return output;
  },
);