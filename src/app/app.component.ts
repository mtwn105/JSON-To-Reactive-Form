import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formNameText: any;
  jsonText: any;
  formText: string = '';
  jsonObj: any;

  generateReactiveForm() {
    if (this.formNameText != null && this.jsonText != null) {
      if (this.formNameText.length > 0 && this.jsonText.length > 0) {
        this.formText = this.formNameText + ': FormGroup;\n\n';
        this.formText += 'initiateFormGroup() {\n';
        this.formText += 'this.' + this.formNameText + ' = new FormGroup({\n';

        this.jsonObj = JSON.parse(this.jsonText);
        let keys = Object.keys(this.jsonObj);

        for (let key of keys) {
          console.log(key, typeof (this.jsonObj[key]));
          if (typeof (this.jsonObj[key]) != 'object') {
            this.formText += key + ':' + ' new FormControl(null),\n';
          } else {
            this.generateReactiveFormForObject(key, this.jsonObj[key]);
          }
        }

        this.formText += '});\n';
        this.formText += '}';
      }
    }
  }

  generateReactiveFormForObject(key: string, value: any) {
    console.log('KEY', key);
    console.log('IS ARRAY', value.length);
    let isArray = value.length;
    if (isArray != null) {
      let keys = Object.keys(value);
      this.formText += key + ': new FormArray([\n';
      this.generateReactiveFormForObjectForArray(value[0]);
      this.formText += ']),\n';
    } else {
      let keys = Object.keys(value);
      this.formText += key + ': new FormGroup({\n';
      for (let key of keys) {
        if (typeof (value[key]) != 'object') {
          this.formText += key + ':' + ' new FormControl(null),\n';
        } else {
          this.generateReactiveFormForObject(key, value[key]);
        }
      }
      this.formText += '}),\n';
    }



  }
  generateReactiveFormForObjectForArray(value: any) {
    let keys = Object.keys(value);
    this.formText += 'new FormGroup({\n';
    for (let key of keys) {
      if (typeof (value[key]) != 'object') {
        this.formText += key + ':' + ' new FormControl(null),\n';
      } else {
        this.generateReactiveFormForObject(key, value[key]);
      }
    }
    this.formText += '}),\n';
  }

}
