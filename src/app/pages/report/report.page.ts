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
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
  ) { }

  private sub: any;
  trip: any;

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params: { [x: string]: any; }) => {
      let id = params['id'];
      this.trip = this.localStorageService.getTrip(id);

      setTimeout(() => {
        const html = document.getElementById("main") as HTMLElement
        const doc = new jsPDF('l');
        let fileName = new Date().toLocaleString().replace(/, /g, "_") + '.pdf'
        doc.html(html, { html2canvas:{scale:0.3 }}).then(() => {
          doc.save(fileName);
        });
      }, 500);

    })
  }

}
