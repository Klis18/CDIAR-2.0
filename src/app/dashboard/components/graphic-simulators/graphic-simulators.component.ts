import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SimuladoresData, SimuladoresGetQuery } from '../../../reports/interfaces/simulator.interface';
import { DashboardService } from '../../services/dashboard.service';

export interface Simulador {
  nombreSimulador: string;
  asignatura: string;
  nivel: string;
  nombreEstudiante: string;
  calificacion: number;
  fechaSimuladorRealizado: string;
}

@Component({
  selector: 'graphic-simulators',
  templateUrl: './graphic-simulators.component.html',
  styles: ``
})
export class GraphicSimulatorsComponent  {
  // public pieChartOptions: ChartOptions<'pie'> = {
  //   responsive: true,
  //   plugins: {
  //     datalabels: {
  //       formatter: (value, ctx) => {
  //         const data = ctx.chart.data.datasets[0].data;
  //         const total = (data as number[]).reduce((a, b) => a + b, 0);
  //         const percentage = (value / total * 100).toFixed(2) + '%';
  //         return percentage;
  //       },
  //       color: '#fff',
  //       labels: {
  //         title: {
  //           font: {
  //             weight: 'bold'
  //           }
  //         }
  //       }
  //     }
  //   }
  // };
  
  // public pieChartData: ChartData<'pie', number[], string | string[]> = {
  //   labels: [],
  //   datasets: [{
  //     data: []
  //   }]
  // };
  
  // public pieChartType: 'pie' = 'pie';

  // constructor(private dashboardService: DashboardService) { }

  // ngOnInit() {
  //   this.dashboardService.obtenerListadoSimuladoresRealizados().subscribe((res) => {
  //     const simuladores = res.data;
  //     console.log(simuladores);
  //     const top5Asignaturas = this.obtenerTop5Asignaturas(simuladores);

  //   this.pieChartData.labels = top5Asignaturas.map(asignatura => asignatura.asignatura);
  //   this.pieChartData.datasets[0].data = top5Asignaturas.map(asignatura => asignatura.cantidad);
  //   this.pieChartData.datasets[0].backgroundColor = ['#E1C233', '#0DC5D5', '#FFCE56', '#FF5733', '#33FF57'];
  //   });
  //   // const simuladores = [
  //   //   { nombreSimulador: 'Simulador 1', asignatura: 'Matemáticas', nivel: '1', nombreEstudiante: 'Juan', calificacion: 90, fechaSimuladorRealizado: '2024-07-24T22:35:19.410Z' },
  //   //   { nombreSimulador: 'Simulador 2', asignatura: 'Física', nivel: '2', nombreEstudiante: 'Maria', calificacion: 85, fechaSimuladorRealizado: '2024-07-24T22:35:19.410Z' },
  //   // ];

  //   // const top5Asignaturas = this.obtenerTop5Asignaturas(simuladores);

  //   // this.pieChartData.labels = top5Asignaturas.map(asignatura => asignatura.asignatura);
  //   // this.pieChartData.datasets[0].data = top5Asignaturas.map(asignatura => asignatura.cantidad);
  //   // this.pieChartData.datasets[0].backgroundColor = ['#E1C233', '#0DC5D5', '#FFCE56', '#FF5733', '#33FF57'];
  // }



  // obtenerTop5Asignaturas(simuladores: any[]) {
  //   const contador: { [key: string]: number } = {};

  //   simuladores.forEach(simulador => {
  //     if (contador[simulador.asignatura]) {
  //       contador[simulador.asignatura]++;
  //     } else {
  //       contador[simulador.asignatura] = 1;
  //     }
  //   });

  //   const top5Asignaturas = Object.entries(contador)
  //     .sort(([, a], [, b]) => b - a)
  //     .slice(0, 5)
  //     .map(([asignatura, cantidad]) => ({ asignatura, cantidad }));

  //   return top5Asignaturas;
  // }
}
