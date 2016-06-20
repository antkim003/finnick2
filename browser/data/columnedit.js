[
    {
        property: 'id',
        header: 'row id',
        cell: [(v) => ({
            value: v,
            props: {

            }
        })],
    columnorder: '0'
},
{
    property: 'sortnumber',
        header: 'Sort Number',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'name',
        header: 'Name',
    cell: [editable({
    editor: editors.input()}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'category',
        header: 'Category',
    cell: [ highlighter('category')],
    columnorder: '0'
},
{
    property: 'subcategories',
        header: 'Subcategories',
    cell: [editable({
    editor: editors.checkbox(categoriesandsub2, 'category', self)
}), highlighter('subcategories')],
    columnorder: '0'
},
{
    property: 'notesoncategory',
        header: 'Notes on Category',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'doubleexposure',
        header: 'Double Exposure',
    cell: [editable({
    editor: editors.checkbox(categoriesandsub)
}), highlighter('doubleexposure')],
    columnorder: '0'
},
{
    property: 'doubleexposuresubcategory',
        header: 'Double Exposure Subcategory',
    cell: [editable({
    editor: editors.checkbox(categoriesandsub1, 'doubleexposure', self)
}), highlighter('doubleexposuresubcategory')],
    columnorder: '0'
},
{
    property: 'pricingcategory',
        header: 'Pricing Category',
    cell: [editable({
    editor: editors.input()
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'instorespecial',
        header: 'In Store Special',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'storeregularprice',
        header: 'Store Reg Price (range)',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
}), highlighter('storeregularprice')],
    columnorder: '0'
},
{
    property: 'storespecialprice',
        header: 'Store Special Price (range)',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'mcomspecial',
        header: 'MCOM Special',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'pricinginfo',
        header: 'Additional Pricing Info',
    cell: [editable({
    editor: editors.dropdown([{name:'Only At Macys', value:'Only At Macys'},{name:'Not Applicable', value:'Not Applicable'},{name:'Custom', value:'Custom'}]),
}), highlighter('pricinginfo')],
    columnorder: '0'
},
{
    property: 'mcomregprice',
        header: 'MCOM Reg Price (range)',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
})],
    columnorder: '0'
},
{
    property: 'mcomspecialprice',
        header: 'MCOM Special Price (range)',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'pricingcomments',
        header: 'Pricing Comments',
    cell: [editable({
    editor: editors.dropdown([{name:'Not Congruent', value:'Not Congruent'},{name:'Congruent', value:'Congruent'},{name:'All Sizes', value:'All Sizes'},{name:'TV Offer', value:'TV Offer'},{name:'GWP', value:'GWP'},{name:'40% Off', value:'40% Off'},{name:'30% Off', value:'30% Off'},{name:'50% Off', value:'50% Off'},{name:'Custom', value:'Custom'}]),
}), highlighter('pricingcomments')],
    columnorder: '0'
},
{
    property: 'markettointernational',
        header: 'Market to International',
    cell: [editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
},
{
    property: 'projectedunits',
        header: 'Projected Units',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
})],
    columnorder: '0'
},
{
    property: 'projectedsales',
        header: 'MCOM Projected Sales',
    cell: [editable({
    editor: editors.rangeinput('sortnumber'),
})],
    columnorder: '0'
},
{
    property: 'salesfor2015',
        header: 'Sales For 2015',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'imageid',
        header: 'Image Id',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
}), highlighter('imageid')],
    columnorder: '0'
},
{
    property: 'arimageid',
        header: 'AR Image Id',
    cell: [
    editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }),
    highlighter('arimageid')],
    columnorder: '0'
},
{
    property: 'singleormultiple',
        header: 'Single or Multiple',
    cell: [editable({
    editor: editors.dropdown([{name: 'Single', value: 'Single'},{name: 'Multiple', value: 'Multiple'}]),
}), highlighter('singleormultiple')],
    columnorder: '0'
},
{
    property: 'featureproductid',
        header: 'Feature Product Ids',
    cell: [
    editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'multinumerical'})),
    }),
    highlighter('featureproductid')],
    columnorder: '0'
},
{
    property: 'savedsetid',
        header: 'Saved Set Ids',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
})],
    columnorder: '0'
},
{
    property: 'tileimage',
        header: 'Tile Image',
    cell: [
    editable({
        editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
    }),
    highlighter('tileimage'),
],
    columnorder: '0'
},
{
    property: 'tilecopy1',
        header: 'Tile Copy Line 1',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'tilecopy2',
        header: 'Tile Copy Line 2',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'tilecopy3',
        header: 'Tile Copy Line 3',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'tilecopy4',
        header: 'Tile Copy Line 4',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'plenti',
        header: 'Plenti Watermark',
    cell: [editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
},
{
    property: 'bffavorites',
        header: 'Black Friday Favorites',
    cell: [editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
},
{
    property: 'goingfast',
        header: 'Going Fast',
    cell: [editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
},
{
    property: 'alsoinpetites',
        header: 'Also in Petites',
    cell: [editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
},
{
    property: 'petitessavedset',
        header: 'Petites Saved Set',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
})],
    columnorder: '0'
},
{
    property: 'needsavedset',
        header: 'Need Saved Set?',
    cell: [editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
},
{
    property: 'linktype',
        header: 'Link Type',
    cell: [editable({
    editor: editors.dropdown([{name:'url (u)', value:'url (u)'},{name:'category (c)', value:'category (c)'},{name:'product (p)', value:'product (p)'}]),
})],
    columnorder: '0'
},
{
    property: 'livedate',
        header: 'Live Date',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'categoryid',
        header: 'Category Id linking',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
})],
    columnorder: '0'
},
{
    property: 'productid',
        header: 'Product Id linking',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
})],
    columnorder: '0'
},
{
    property: 'url',
        header: 'Url linking',
    cell: [editable({
    editor: editors.input(),
})],
    columnorder: '0'
},
{
    property: 'petiteslinktype',
        header: 'Petites Link Type',
    cell: [editable({
    editor: editors.dropdown([{name:'url (u)', value:'url (u)'},{name:'category (c)', value:'category (c)'},{name:'product (p)', value:'product (p)'}]),
})],
    columnorder: '0'
},
{
    property: 'petitescategoryid',
        header: 'Petites Category Linking',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
}), highlighter('petitescategoryid')],
    columnorder: '0'
},
{
    property: 'petitesproductid',
        header: 'Petites Product Linking',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'numerical'})),
}), highlighter('petitesproductid')],
    columnorder: '0'
},
{
    property: 'petitesurl',
        header: 'Petites Url Linking',
    cell: [editable({
    editor: editors.input(),
}), highlighter('name')],
    columnorder: '0'
},
{
    property: 'omniprojectedsales',
        header: 'Omni Projected Sales',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
})],
    columnorder: '0'
},
{
    property: 'extraomniprojectedsales',
        header: 'Extra Omni Projected Sales',
    cell: [editable({
    editor: editors.input(_.filter(validations, function(v) { return v.name == 'currency'})),
})],
    columnorder: '0'
},
{
    property: 'killedrow',
        header: 'Killed Row',
    cell: [editable({
    editor: editors.dropdown([{name:'true', value:'true'},{name:'false', value:'false'}]),
})],
    columnorder: '0'
}
]