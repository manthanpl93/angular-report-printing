import { Component, OnInit } from '@angular/core';
import { faFile } from '@fortawesome/free-solid-svg-icons';
//import { CertificateMaker } from '../../../library/certificate-maker'
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';
const CERTFICATES = [
  {
    firstName: 'Manthan',
    lastName: 'Patel',
    type: 'Promotion',
    dynamic: true,
  },
  {
    firstName: 'Shreyansh',
    lastName: 'Seth',
    type: 'Promotion',
    dynamic: true,
  },
  {
    firstName: 'Dyaneshwar',
    lastName: 'B',
    type: 'Promotion',
    dynamic: true,
  },
  {
    firstName: 'Yesha',
    lastName: 'B',
    type: 'Promotion',
    dynamic: false,
  }
];

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})



export class CertificatesComponent implements OnInit {
  certficates = CERTFICATES;
  faFile = faFile;
  documentViewer = false;
  pdfDataUri = null;
  certificateConfig = null;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  async openPdfViewer(certficate) {
    const config = this.getCertificateConfig(certficate)
    this.certificateConfig = config;
    const pdfDOC: jsPDF = await this.getPDFCertificate();
    this.pdfDataUri = pdfDOC.output('datauristring');
    this.documentViewer = true;
  }

  getCertificateConfig(certficate) {

    const backgroundImage = certficate.dynamic ?
      "/assets/images/Fire Promotion Certificate.jpg" :
      "/assets/images/layout2.jpg";

    return {
      dynamic: certficate.dynamic,
      headerLogo: "/assets/images/square-logo.png",
      backgroundImage,
      dynamicFields: {
        member: "member1",
        fullName: `${certficate.firstName} ${certficate.lastName}`,
        gradingDate: "25 May 2021",
        achieved: "Brown Belt with Black Stripe",
        studioName: "Martial Arts SA - Leadership Academy",
      },
      year: 2021,
      signatureImage: "/assets/images/signature.png",
      signatureInfo: {
        personInfo: `Master Instructor
        Ray Sargeant
        5TH DAN BLACKBELT`,
        subheadingTitle: "Accredited Member",
        subheadingValue: "World Moo Duk Kwan",
      },
      footerLogo: "/assets/images/rounded-logo.png",
    }
  }

  closePdfViewer() {
    this.documentViewer = false;
  }

  async getPDFCertificate() {
    const certificate = document.getElementById("certificate-viewer");
    certificate.style.display = 'block';
    const divHeight = certificate.clientHeight
    const divWidth = certificate.clientWidth
    const ratio = divHeight / divWidth;
    const canvas = await html2canvas(certificate, {
      scale: 0.7
    });
    const imgData = canvas.toDataURL('image/png');
    const pdfDOC = new jsPDF('p', 'pt', 'a4', true);
    const width = pdfDOC.internal.pageSize.getWidth();
    let height = pdfDOC.internal.pageSize.getHeight();
    height = ratio * width;
    pdfDOC.addImage(imgData, 'JPEG', 0, 0, width, height);
    return pdfDOC;
  }

  async mergePdfs(pdfsToMerges: ArrayBuffer[]) {
    const mergedPdf = await PDFDocument.create();
    const actions = pdfsToMerges.map(async pdfBuffer => {
      const pdf = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        // console.log('page', page.getWidth(), page.getHeight());
        // page.setWidth(210);
        mergedPdf.addPage(page);
      });
    });
    await Promise.all(actions);
    const mergedPdfFile = await mergedPdf.saveAsBase64({ dataUri: true })
    return mergedPdfFile;
  }



  async downloadAllCertficate() {
    const certificates = this.certficates;
    const pdfsToMerges: ArrayBuffer[] = []
    for (var itr = 0; itr < certificates.length; itr++) {
      const certificate = certificates[itr];
      console.log(certificate)
      const config = this.getCertificateConfig(certificate);
      this.certificateConfig = config;
      const pdfDOC: jsPDF = await this.getPDFCertificate();
      const arrayBuffer = pdfDOC.output('arraybuffer');
      pdfsToMerges.push(arrayBuffer);
    }
    const mergedPdfDataStringUri = await this.mergePdfs(pdfsToMerges);
    this.pdfDataUri = mergedPdfDataStringUri;
    this.documentViewer = true;
  }


}