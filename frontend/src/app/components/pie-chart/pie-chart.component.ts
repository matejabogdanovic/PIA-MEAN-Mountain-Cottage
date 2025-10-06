import { Component, Input, OnInit } from '@angular/core';

import {
  Chart,
  ChartData,
  ChartOptions,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Cottage } from '../../models/Cottage';
import { ReservationPopulated } from '../../models/Reservation';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
})
export class PieChartComponent implements OnInit {
  @Input() rezervacijeOstvarene: ReservationPopulated[] = [];
  @Input() cottage!: Cottage;
  weekendCount = 0;
  weekdayCount = 0;

  ngOnInit(): void {
    Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

    this.rezervacijeOstvarene.forEach((r) => {
      const start = new Date(r.od);
      const end = new Date(r.do);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay(); // 0 = nedelja, 6 = subota
        if (day === 0 || day === 6) {
          this.weekendCount++;
        } else {
          this.weekdayCount++;
        }
      }
    });

    const newDatasets = [
      {
        data: [this.weekendCount, this.weekdayCount],

        backgroundColor: [
          'oklch(75% 0.183 55.934)',
          'oklch(43.2% 0.095 166.913) ',
        ],
      },
    ];

    this.pieChartData = {
      labels: this.pieChartData.labels,
      datasets: newDatasets,
    };
  }
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Weekend', 'Workday'],
    datasets: [
      {
        data: [0, 0],
      },
    ],
  };
}
