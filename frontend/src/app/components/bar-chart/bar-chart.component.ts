import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import {
  Chart,
  ChartData,
  ChartType,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { ReservationPopulated } from '../../models/Reservation';
import { Cottage } from '../../models/Cottage';

Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
);
@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent implements OnInit {
  barChartOptions: ChartOptions<'bar'> = { responsive: true };
  barChartLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  barChartType: 'bar' = 'bar';
  @Input() rezervacijeOstvarene: ReservationPopulated[] = [];
  @Input() cottage!: Cottage;
  barChartData: ChartData<'bar', number[], string> = {
    labels: this.barChartLabels,
    datasets: [],
  };

  ngOnInit(): void {
    Chart.register(
      CategoryScale,
      LinearScale,
      BarController,
      BarElement,
      Title,
      Tooltip,
      Legend
    );

    const newDatasets = [
      {
        data: this.brojRezervacijaPoMesecima(this.rezervacijeOstvarene),
        label: this.cottage.naziv,
        backgroundColor: 'oklch(43.2% 0.095 166.913) ',
      },
    ];

    this.barChartData = {
      labels: this.barChartLabels,
      datasets: newDatasets,
    };
  }

  brojRezervacijaPoMesecima(rezervacije: ReservationPopulated[]): number[] {
    const rezPoMesecima = Array(12).fill(0);

    rezervacije.forEach((r) => {
      const month = new Date(r.od).getMonth();
      rezPoMesecima[month]++;
    });

    return rezPoMesecima;
  }
}
