import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
  ) { }

  private sub: any;
  trip: any;

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params: { [x: string]: any; }) => {
      let id = params['id'];
      this.trip = this.localStorageService.getTrip(id);
      console.log(this.trip);

      setTimeout(() => {
        const html = document.getElementById("main") as HTMLElement
        const doc = new jsPDF('l', 'mm', [1100, 1110]);
        let fileName = new Date().toLocaleString().replace(/, /g, "_") + '.pdf'
        doc.html(html, { html2canvas:{scale:0.4}}).then(() => {
          doc.save(fileName);
        });
      }, 500);

    })
  }

}
