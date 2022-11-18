import { Component, VERSION } from '@angular/core';
import { data } from './GUIShop';
import { CopyContentService } from './copy-content.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  data = {};
  shopList = {};
  deletedItems = {};

  constructor(private copier: CopyContentService) {}
  ngOnInit() {
    this.data = data;
    this.shopList = this.data['Shop - Shop List'];
    console.log(this.shopList);
  }

  getKeys(item: any) {
    return Object.keys(item);
  }

  deleteItem(key: string) {
    this.deletedItems[key] = this.shopList[key];
    delete this.shopList[key];
  }

  restoreItem(key: string) {
    this.shopList[key] = this.deletedItems[key];
    delete this.deletedItems[key];
  }

  copyShop() {
    this.data['Shop - Shop List'] = this.shopList;
    const shopKeys = this.getKeys(this.shopList);
    const categories = this.data['Shop - Shop Categories'];
    const newCats = Object.keys(categories).reduce((acc, next) => {
      const currCat = categories[next];
      const filteredCatItems = currCat.Items.filter(
        (x) => shopKeys.indexOf(x) !== -1
      );
      currCat.Items = filteredCatItems;
      acc[next] = currCat;
      return acc;
    }, {});
    this.data['Shop - Shop Categories'] = newCats;
    console.log('new', this.data['Shop - Shop Categories']);
    this.copier.copyText(JSON.stringify(this.data));
  }
}
