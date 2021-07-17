import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';

let cat = ["", "", "", ""]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements AfterViewInit {
  @ViewChild("canva") canvas: ElementRef | undefined;
  context!: CanvasRenderingContext2D;

  ngAfterViewInit() {

    this.context = this.canvas?.nativeElement.getContext("2d")
  }

  onclick(arg: string, num: number) {
    console.log(arg);
    cat[num] = arg;
    console.log(cat);
  }

  async generate() {
    if (!(cat.some(elem => elem == ""))) {
      console.log("valid")
      console.log(this.context.toString())

      let catimgs: [HTMLImageElement, Promise<void>][] = []
      for (let i = 0; i < 4; i++) {
        const img = new Image()
        img.src = cat[i]
        catimgs[i] = [img, new Promise<void>(resolve => img.onload = () => resolve())];
      }

      await Promise.all(catimgs.map(v => v[1]));
      this.context.clearRect(0, 0, 512, 512)
      for (let i = 0; i < 4; i++) {
        const [img,] = catimgs[i];
        this.context.drawImage(img, 0, 0)
      }
    } else {
      alert("invalid")
    }
  }

  savecanvas() {
    var image = this.canvas?.nativeElement.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

    var anchor = document.createElement('a');
    anchor.setAttribute('download', 'cat.png');
    anchor.setAttribute('href', image);
    anchor.click(); // it will save locally
  }
}
