import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import tilestyle from '../../browser/css/homepagepreview.css';

var HomepageComponent = require('../../browser/homepage/homepage.js');

class HomepagePreview extends Component {
  componentWillMount() {

  }

  render () {
        var mapnames = {
            'intlWomen' : "International Women",
            'IntlWomen' : "International Women",
            'intljuniors': "International Juniors",
            'intlforthehome': 'International For the Home',
            'intlkitchen&dining': 'International Kitchen and Dining',
            'intlbed&bath': 'International Bed and Bath',
            'intlluggage&accessories': 'International Luggage and Accessories',
            'handbags&accessories': 'Handbags and Accessories',
            'juniors': 'Juniors',
            'beauty': 'Beauty',
            'for_the_home': 'For the Home',
            'kitchen&dining': 'Kitchen and Dining',
            'bed&bath': 'Bed and Bath',
            'luggage&accessories': 'Luggage and Accessories',
            'furniture&mattresses': "Furniture and Mattresses",
            'intlmen': 'International Men',
            'intlkids': 'International Kids',
            'intlshoes': "International Shoes",
            "intljewelry&Watches": 'International Jewelry and Watches',
            "intlhandbags&Accessories": 'International Handbags and Accessories',
            'women': "Women",
            "men": "Men",
            "kids": "Kids",
            "shoes": 'Shoes',
            'jewelry&watches': 'Jewelry and Watches',
            'jewlery&watches': 'Jewelry and Watches',
        }

    return (
      <div className="home">
          <div className="container">
            <h1>Homepage Preview</h1>
            <div className="formforupload">
                upload image by fob, please select whether mobile image or not
                <form action="/api/combobulator/upload" method="post" encType="multipart/form-data">
                    <select name="fob">
                        <option>select fob</option>
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="kids">Kids</option>
                        <option value="shoes">Shoes</option>
                        <option value="jewlery&watches">Jewelry and Watches</option>
                        <option value="beauty">Beauty</option>
                    </select>
                    is this for mobile
                    <select name="mobile">
                        <option value="false">no</option>
                        <option value="true">yes</option>
                    </select>

                    <input type="file" name="displayImage"/>
                    <input type="submit"/>
                </form>
                <HomepageComponent />
            </div>
          </div>

      </div>
    )

  }
}

module.exports = HomepagePreview;
