'use strict';

module.exports =
    [
        {
            type: 'buyer_lead',
            permission: ['subcategories','notesoncategory','doubleexposure','doubleexposuresubcategory','pricingcategory','instorespecial','storeregularprice','storespecialprice','mcomspecial','pricinginfo','mcomregprice','pricingcomments','markettointernational','projectedunits','projectedsales','salesfor2015','imageid','arimageid','singleormultiple','featureproductid','plenti','bffavorites','goingfast','alsoinpetites','livedate','omniprojectedsales','extraomniprojectedsales','typeofspecial']
        },
        {
            type: 'buyer',
            permission: ['subcategories','notesoncategory','doubleexposure','doubleexposuresubcategory','pricingcategory','instorespecial','storeregularprice','storespecialprice','mcomspecial','pricinginfo','mcomregprice','pricingcomments','markettointernational','projectedunits','projectedsales','salesfor2015','imageid','arimageid','singleormultiple','featureproductid','plenti','bffavorites','goingfast','alsoinpetites','livedate','omniprojectedsales','extraomniprojectedsales','typeofspecial']
        },
        {
            type: 'admin',
            permission: ['all']
        },
        {
            type: 'photography',
            permission: ['arimageid','tileimage']
        },
        {
            type: 'photography_lead',
            permission: ['arimageid','tileimage']
        },
        {
            type: 'site_merch',
            permission: ['savedsetid','petitessavedset','linktype','needsavedset','categoryid','productid','url','petiteslinktype','petitescategoryid','petitesproductid','petitesurl']
        },
        {
            type: 'site_merch_lead',
            permission: ['savedsetid','petitessavedset','linktype','needsavedset','categoryid','productid','url','petiteslinktype','petitescategoryid','petitesproductid','petitesurl']
        },
        {
            type: 'marketing',
            permission: []
        },
        {
            type: 'copywriter',
            permission: ['tilecopy1','tilecopy2','tilecopy3','tilecopy4']
        },
        {
            type: 'copywriter_lead',
            permission: ['tilecopy1','tilecopy2','tilecopy3','tilecopy4']
        },
        {
            type: 'copy',
            permission: ['tilecopy1','tilecopy2','tilecopy3','tilecopy4']
        },
        {
            type: 'copy_lead',
            permission: ['tilecopy1','tilecopy2','tilecopy3','tilecopy4']
        },
    ]