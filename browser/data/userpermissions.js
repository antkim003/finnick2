'use strict';

module.exports =
    [
        {
            type: 'buying',
            permission: ['subcategories','notesoncategory','doubleexposure','doubleexposuresubcategory','doubleexposure2','doubleexposuresubcategory2','doubleexposure3','mcomspecialprice', 'doubleexposuresubcategory3','instorespecial','storeregularprice','storespecialprice','mcomspecial','pricinginfo','mcomregprice','pricingcomments','markettointernational','projectedunits','projectedsales','notesfrombuyersimg','salesfor2015','imageid','arimageid','singleormultiple','featureproductid','alsoinpetites','livedate','omniprojectedsales','extraomniprojectedsales','typeofspecial']
        },
        // {
        //     type: 'buyer',
        //     permission: ['subcategories','notesoncategory','doubleexposure','doubleexposuresubcategory','doubleexposure2','doubleexposuresubcategory2','doubleexposure3','mcomspecialprice', 'doubleexposuresubcategory3','instorespecial','storeregularprice','storespecialprice','mcomspecial','pricinginfo','mcomregprice','pricingcomments','markettointernational','projectedunits','projectedsales','notesfrombuyersimg','salesfor2015','imageid','arimageid','singleormultiple','featureproductid','alsoinpetites','livedate','omniprojectedsales','extraomniprojectedsales','typeofspecial']
        // },
        {
            type: 'admin',
            permission: ['all']
        },
        {
            type: 'photography',
            permission: ['arimageid','tileimage', 'notesfromretouchimg', 'photoprogress','imageid']
        },
        {
            type: 'site_merch',
            permission: ['savedsetid','petitessavedset','linktype','needsavedset','categoryid','productid','url','petiteslinktype','petitescategoryid','petitesproductid','petitesurl']
        },
        {
            type: 'marketing',
            permission: []
        },
        {
            type: 'copywriter',
            permission: ['tilecopy1','tilecopy2','tilecopy3','tilecopy4','tilestyle']
        },
        {
            type: 'copy',
            permission: ['tilecopy1','tilecopy2','tilecopy3','tilecopy4','tilestyle']
        }
    ]
