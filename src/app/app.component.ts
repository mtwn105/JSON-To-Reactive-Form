import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private snackBar: MatSnackBar
  ) {
  }

  generateReactiveForm() {
    this.jsonInvalid = false;
    if (this.formNameText != null && this.jsonText != null) {
      if (this.formNameText.length > 0 && this.jsonText.length > 0) {

        try {

          this.jsonObj = JSON.parse(this.jsonText);
          const keys = Object.keys(this.jsonObj);
          this.formText = this.formNameText + ': FormGroup;\n\n';
          this.formText += 'initiateFormGroup() {\n';
          this.formText += this.getTabs(1);
          this.formText += 'this.' + this.formNameText + ' = new FormGroup({\n';

          for (const key of keys) {
            console.log(key, typeof (this.jsonObj[key]));
            if (this.jsonObj[key] != null) {
              if (typeof (this.jsonObj[key]) != 'object') {
                this.formText += this.getTabs(2);
                this.formText += key + ':' + ' new FormControl(null),\n';
              } else {
                this.generateReactiveFormForObject(key, this.jsonObj[key], 3);
              }
            } else {
              throw new Error('Invalid JSON');
            }
          }
          this.formText += this.getTabs(1);
          this.formText += '});\n';
          this.formText += '}';
        } catch (e) {
          this.jsonInvalid = true;
          let snackBarRef = this.snackBar.open('Please provide valid JSON', 'Close', { duration: 2000 });
          this.formText = '';
        }
      }
    }
  }

  generateReactiveFormForObject(key: string, value: any, level: any) {
    console.log('KEY', key);
    console.log('IS ARRAY', value.length);
    const isArray = value.length;
    if (isArray != null) {
      const keys = Object.keys(value);
      this.formText += this.getTabs(level - 1);
      this.formText += key + ': new FormArray([\n';
      this.generateReactiveFormForObjectForArray(value[0], level);
      this.formText += this.getTabs(level - 1);
      this.formText += ']),\n';
    } else {
      const keys = Object.keys(value);
      this.formText += this.getTabs(level - 1)
      this.formText += key + ': new FormGroup({\n';

      for (const key of keys) {
        if (value[key] != null) {
          if (typeof (value[key]) != 'object') {
            this.formText += this.getTabs(level);
            this.formText += key + ':' + ' new FormControl(null),\n';
          } else {
            this.generateReactiveFormForObject(key, value[key], level + 1);
          }
        } else {
          throw new Error('Invalid JSON');
        }
      }
      this.formText += this.getTabs(level - 1)
      this.formText += '}),\n';
    }
  }

  generateReactiveFormForObjectForArray(value: any, level: any) {
    const keys = Object.keys(value);
    this.formText += this.getTabs(level);
    this.formText += 'new FormGroup({\n';

    for (const key of keys) {
      if (value[key] != null) {
        if (typeof (value[key]) != 'object') {
          this.formText += this.getTabs(level + 1);
          this.formText += key + ':' + ' new FormControl(null),\n';
        } else {
          this.generateReactiveFormForObject(key, value[key], level + 2);
        }
      } else {
        throw new Error('Invalid JSON');
      }
    }
    this.formText += this.getTabs(level);
    this.formText += '}),\n';
  }

  getTabs(level) {
    let tabs = '';
    for (let index = 0; index < level; index++) {
      tabs += '\t';
    }
    return tabs;
  }

  copyFormToClipboard(formOutput) {
    formOutput.select();
    document.execCommand('copy');
    formOutput.setSelectionRange(0, 0);
    let snackBarRef = this.snackBar.open('Copied to Clipboard', 'Close', { duration: 2000 });
  }

}
