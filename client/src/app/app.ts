import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Milestone {
  title: string;
  durationWeeks: number;
  outcome: string;
}

interface DemoPlan {
  title: string;
  pitch: string;
  problem: string;
  audience: string;
  availability: string;
  technologies: string[];
  milestones: Milestone[];
  caseStudySections: string[];
}

@Component({
  imports: [FormsModule],
  selector: 'app-root',
  templateUrl: './planner.html',
})
export class App {
  protected profile = '';
  protected objective = '';
  protected interests = 'educação, comunidade';
  protected technologies = 'Angular, TypeScript';
  protected availableWeeks = 6;
  protected weeklyHours = 5;
  protected readonly plan = signal<DemoPlan | null>(null);

  protected generateDemoPlan(): void {
    const interestList = this.splitList(this.interests);
    const technologyList = this.splitList(this.technologies);
    const focus = interestList[0] ?? 'seu tema de interesse';
    const milestoneCount = Math.min(3, this.availableWeeks);
    const phases = [
      { title: 'Investigar e definir', outcome: 'Problema, público e escopo do MVP definidos.' },
      { title: 'Projetar e construir', outcome: 'Fluxo principal implementado e acessível.' },
      { title: 'Refinar e apresentar', outcome: 'Projeto publicado com um estudo de caso claro.' },
    ];
    const milestones = Array.from({ length: milestoneCount }, (_, index) => {
      const phase = phases[index] ?? phases[phases.length - 1];
      return {
        title: phase.title,
        durationWeeks: Math.floor(this.availableWeeks / milestoneCount)
          + (index < this.availableWeeks % milestoneCount ? 1 : 0),
        outcome: phase.outcome,
      };
    });

    this.plan.set({
      title: `Uma experiência digital para ${focus}`,
      pitch: `Uma aplicação web para transformar interesse em ação. O recorte também ajuda a demonstrar: ${this.objective.trim()}`,
      problem: `Informações e recursos sobre ${focus} costumam estar dispersos. O projeto pode reunir uma jornada simples em um só lugar.`,
      audience: `Pessoas que querem se envolver mais com ${focus}, começando por um recorte local e fácil de validar.`,
      availability: `${this.availableWeeks} semanas · ${this.weeklyHours} horas por semana`,
      technologies: technologyList.length ? technologyList : ['Angular', 'TypeScript'],
      milestones,
      caseStudySections: [
        'Contexto e problema observado',
        'Decisões de produto e acessibilidade',
        'Processo, aprendizados e próximos passos',
      ],
    });
  }

  private splitList(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
