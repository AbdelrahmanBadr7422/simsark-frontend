import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
})
export class About {
  team = [
    { name: 'Osama Mohamed', role: 'Founder & CEO', img: '' },
    { name: 'Sarah Ahmed', role: 'Head of Marketing', img: '' },
    { name: 'Ali Hassan', role: 'Lead Developer', img: '' },
  ];
}
