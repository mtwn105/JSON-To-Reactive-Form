import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formNameText: any;
  jsonText: any;
  formText = '';
  jsonObj: any;
  jsonInvalid: any;

  generateReactiveForm() {
    if (this.formNameText != null && this.jsonText != null) {
      if (this.formNameText.length > 0 && this.jsonText.length > 0) {

        try {

          this.jsonObj = JSON.parse(this.jsonText);
          const keys = Object.keys(this.jsonObj);
          this.formText = this.formNameText + ': FormGroup;\n\n';
          this.formText += 'initiateFormGroup() {\n';
          this.formText += 'this.' + this.formNameText + ' = new FormGroup({\n';



          for (const key of keys) {
            console.log(key, typeof (this.jsonObj[key]));
            if (this.jsonObj[key] != null) {
              if (typeof (this.jsonObj[key]) != 'object') {
                this.formText += key + ':' + ' new FormControl(null),\n';
              } else {
                this.generateReactiveFormForObject(key, this.jsonObj[key]);
              }
            } else {
              throw new Error('Invalid JSON');
            }

          }

          this.formText += '});\n';
          this.formText += '}';
        } catch (e) {
          this.jsonInvalid = true;
        }


      }
    }
  }

  generateReactiveFormForObject(key: string, value: any) {
    console.log('KEY', key);
    console.log('IS ARRAY', value.length);
    const isArray = value.length;
    if (isArray != null) {
      const keys = Object.keys(value);
      this.formText += key + ': new FormArray([\n';
      this.generateReactiveFormForObjectForArray(value[0]);
      this.formText += ']),\n';
    } else {
      const keys = Object.keys(value);
      this.formText += key + ': new FormGroup({\n';
      for (const key of keys) {
        if (value[key] != null) {
          if (typeof (value[key]) != 'object') {
            this.formText += key + ':' + ' new FormControl(null),\n';
          } else {
            this.generateReactiveFormForObject(key, value[key]);
          }
        } else {
          throw new Error('Invalid JSON');
        }
      }
      this.formText += '}),\n';
    }



  }
  generateReactiveFormForObjectForArray(value: any) {
    const keys = Object.keys(value);
    this.formText += 'new FormGroup({\n';
    for (const key of keys) {
      if (value[key] != null) {
        if (typeof (value[key]) != 'object') {
          this.formText += key + ':' + ' new FormControl(null),\n';
        } else {
          this.generateReactiveFormForObject(key, value[key]);
        }
      } else {
        throw new Error('Invalid JSON');
      }

    }
    this.formText += '}),\n';
  }

}
