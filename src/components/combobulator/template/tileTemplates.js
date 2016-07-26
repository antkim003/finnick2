htmlpartials = {
			  "tiletemplatea": "\n\n<div class=\"tile\">" + 

"<div class=\"tile-img-wrap\">" + 

    "<a href=\"<%= data.dummylink %>\" class=\"tile-img-link\">" + 

        "<img src=\"http://slimages.macys.com/is/image/MCY/products/6/optimized/<%= data.tileimage %>_fpx.tif?bgc=255,255,255&wid=228&qlt=90,0&fmt=jpeg\" class=\"tile-img\"/>" + 

    "</a>" + 

    "<a href=\"http://www.pinterest.com/pin/create/button/?url=\"<%= data.tileimage %>\"&description=\"<%= data.mcomspecial %>\" class=\"tile-img-pin\" data-pin-do=\"buttonPin\" data-pin-shape=\"round\">" + 

        "<img src=\"http://assets.pinterest.com/images/pidgets/pinit_fg_en_round_red_16.png\" class=\"tile-pin\"/>" + 

    "</a>" + 
    "<img class=\"only-banner <%= data.onlineonly %>\" src=\"" + static_url + "cms/public/prod/combobulator/img/online-only.jpg\"></img>" + 
    "<img class=\"only-banner <%= data.instoreonly %>\" src=\"" + static_url + "cms/public/prod/combobulator/img/instore-only.jpg\"></img>" + 
"</div>" + 

"<div class=\"tile-content\">" + 

    "<span class=\"tile-title_1 tile-title\">" + 

        "<%= data.tilecopyline1 %>" + 

    "</span>" + 

    "<span class=\"tile-title_2 tile-title\">" + 

        "<%= data.tilecopyline2 %>" + 

    "</span>" + 

    "<p class=\"tile-desc\">" + 

        "<span class=\"tile-desc-line_1 tile-desc-line\">" + 

            "<%= data.tilecopyline3 %>" + 

        "</span>" + 

        "<span class=\"tile-desc-line_2 tile-desc-line\">" + 

            "<%= data.tilecopyline4 %>" + 

        "</span>" + 

        "<% if (data.alsoinpetites == 'Yes') { %>" + 

            "<span class=\"tile-desc-line tile-desc-line_3\">" + 

                "also in petite" + 
            "</span>" + 

        "<% } %>" + 

    "</p>" + 

    "<div class=\"tile-btns\">" + 

        "<a href=\"/#/some-link-here-to-add-to-your-list\" class=\"tile-btn_add tile-btn tile-btn_addToList\">" + 

            "ADD TO LIST" + 
        "</a>" + 

        "<a href=\"#\" class=\"tile-btn_added tile-btn\">" + 

            "ADDED" + 
        "</a>" + 

        "<a href=\"/#/some-link-here-to-add-to-shop-now\" class=\"tile-btn_shop tile-btn\">" +

            "SHOP NOW" + 
        "</a>" + 

    "</div>" + 

"</div>\n<div class='imageinfo'>Image ID: <%= data.tileimage %><br>Row: <%= data.row %></div></div>",

			  "tiletemplateb": "<div class=\"tile\">" + 

"<div class=\"tile-img-wrap\">" + 

    "<a href=\"<%= data.dummylink %>\" class=\"tile-img-link\">" + 

        "<img src=\"http://slimages.macys.com/is/image/MCY/products/6/optimized/<%= data.tileimage %>_fpx.tif?bgc=255,255,255&wid=228&qlt=90,0&fmt=jpeg\" class=\"tile-img\"\/>" + 

    "<\/a>" + 

    "<a href=\"http:\/\/www.pinterest.com\/pin\/create\/button\/?url=\"<%= data.tileimage %>\"&description=\"<%= data.mcomspecial %>\" class=\"tile-img-pin\" data-pin-do=\"buttonPin\" data-pin-shape=\"round\">" + 

        "<img src=\"http:\/\/assets.pinterest.com\/images\/pidgets\/pinit_fg_en_round_red_16.png\" class=\"tile-pin\"\/>" + 

    "<\/a>" + 

    "<img class=\"only-banner <%= data.onlineonly %>\" src=\"" + static_url + "cms/public/prod/combobulator/img/online-only.jpg\"></img>" + 
    "<img class=\"only-banner <%= data.instoreonly %>\" src=\"" + static_url + "cms/public/prod/combobulator/img/instore-only.jpg\"></img>" + 

"<\/div>" + 

"<div class=\"tile-content\">" + 

    "<span class=\"tile-title_1 tile-title\">" + 

        "<%= data.tilecopyline1 %>" + 

    "<\/span>" + 

    "<span class=\"tile-title_2 tile-title\">" + 

        "<%= data.tilecopyline2 %>" + 

    "<\/span>" + 

    "<p class=\"tile-desc\">" + 

        "<span class=\"tile-desc-line_1 tile-desc-line\">" + 

            "<%= data.tilecopyline3 %>" + 

        "<\/span>" + 

        "<span class=\"tile-desc-line_2 tile-desc-line\">" + 

            "<%= data.tilecopyline4 %>" + 

        "<\/span>" +
            "<span class=\"tile-desc-line tile-desc-line_3\">" +
                "<%= data.dummysaledate %>" +
            "<\/span>" + 

    "<\/p>" + 

    "<div class=\"tile-btns\">" + 

        "<a href=\"\/#\/some-link-here-to-add-to-your-list\" class=\"tile-btn_add tile-btn tile-btn_addToList\">" + 

            "ADD TO LIST" + 
        "<\/a>" + 

        "<a href=\"#\" class=\"tile-btn_added tile-btn\">" + 

            "ADDED" + 
        "<\/a>" + 

        "<a href=\"\/#\/some-link-here-to-add-to-shop-now\" class=\"tile-btn_shop tile-btn\">" + 

            "SHOP NOW" + 
        "<\/a>" + 

    "<\/div>" + 

"<\/div>\r\n\t<div class='imageinfo'>Image ID: <%= data.tileimage %><br>Row: <%= data.row %></div><\/div>",

			  "tiletemplatec": "<div class=\"tile\">" + 

"<div class=\"tile-img-wrap\">" + 

    "<a href=\"<%= data.dummylink %>\" class=\"tile-img-link\">" + 

        "<img src=\"http://slimages.macys.com/is/image/MCY/products/6/optimized/<%= data.tileimage %>_fpx.tif?bgc=255,255,255&wid=228&qlt=90,0&fmt=jpeg\" class=\"tile-img\"\/>" + 

    "<\/a>" + 

    "<a href=\"http:\/\/www.pinterest.com\/pin\/create\/button\/?url=\"<%= data.tileimage %>\"&description=\"<%= data.mcomspecial %>\" class=\"tile-img-pin\" data-pin-do=\"buttonPin\" data-pin-shape=\"round\">" + 

        "<img src=\"http:\/\/assets.pinterest.com\/images\/pidgets\/pinit_fg_en_round_red_16.png\" class=\"tile-pin\"\/>" + 

    "<\/a>" + 

    "<img class=\"only-banner <%= data.onlineonly %>\" src=\"" + static_url + "cms/public/prod/combobulator/img/online-only.jpg\"></img>" + 
    "<img class=\"only-banner <%= data.instoreonly %>\" src=\"" + static_url + "cms/public/prod/combobulator/img/instore-only.jpg\"></img>" + 

"<\/div>" + 

"<div class=\"tile-content\">" + 

    "<span class=\"tile-title_1 tile-title narrow\">" + 

        "<%= data.tilecopyline1 %>" + 

    "<\/span>" + 

    "<p class=\"tile-desc\">" + 

        "<span class=\"tile-desc-line_1 tile-desc-line\">" + 

            "<%= data.tilecopyline2 %>" + 

        "<\/span>" + 

        "<span class=\"tile-desc-line_2 tile-desc-line\">" + 

            "<%= data.tilecopyline3 %>" + 

        "<\/span>" + 

    "<\/p>" + 

    "<div class=\"tile-btns\">" + 

        "<a href=\"\/#\/some-link-here-to-add-to-your-list\" class=\"tile-btn_add tile-btn tile-btn_addToList\">" + 

            "ADD TO LIST" + 
        "<\/a>" + 

        "<a href=\"#\" class=\"tile-btn_added tile-btn\">" + 

            "ADDED" + 
        "<\/a>" + 

        "<a href=\"\/#\/some-link-here-to-add-to-shop-now\" class=\"tile-btn_shop tile-btn\">" + 

            "SHOP NOW" + 
        "<\/a>" + 

    "<\/div>" + 

"<\/div>\r\n\t<div class='imageinfo'>Image ID: <%= data.tileimage %><br>Row: <%= data.row %></div><\/div>",

			  "tiletemplated": "<div class=\"tile\">" + 

"<div class=\"tile-img-wrap\">" + 

    "<a href=\"<%= data.dummylink %>\" class=\"tile-img-link\">" + 

        "<img src=\"http://slimages.macys.com/is/image/MCY/products/6/optimized/<%= data.tileimage %>_fpx.tif?bgc=255,255,255&wid=228&qlt=90,0&fmt=jpeg\" class=\"tile-img\"\/>" + 

    "<\/a>" + 

    "<a href=\"http:\/\/www.pinterest.com\/pin\/create\/button\/?url=\"<%= data.tileimage %>\"&description=\"<%= data.mcomspecial %>\" class=\"tile-img-pin\" data-pin-do=\"buttonPin\" data-pin-shape=\"round\">" + 

        "<img src=\"http:\/\/assets.pinterest.com\/images\/pidgets\/pinit_fg_en_round_red_16.png\" class=\"tile-pin\"\/>" + 

    "<\/a>" + 

    "<img class=\"only-banner <%= data.onlineonly %>\" src=\"" + static_url + "cms/public/prod/combobulator/img/online-only.jpg\"></img>" + 
    "<img class=\"only-banner <%= data.instoreonly %>\" src=\"" + static_url + "cms/public/prod/combobulator/img/instore-only.jpg\"></img>" + 

"<\/div>" + 

"<div class=\"tile-content\">" + 

"\t<div class=\"pretext\">" + 

"\t\t<%= data.category %>" + 

"\t<\/div>" + 

    "<span class=\"tile-title_1 tile-title narrow\">" + 

        "<%= data.tilecopyline1 %>" + 

    "<\/span>" + 

     "<span class=\"tile-title_2 tile-title\">" + 

        "<%= data.tilecopyline2 %>" + 

    "<\/span>" + 

    "<p class=\"tile-desc\">" + 

        "<span class=\"tile-desc-line_1 tile-desc-line\">" + 

            "<%= data.tilecopyline3 %>" + 

        "<\/span>" + 

    "<\/p>" + 

    "<div class=\"tile-btns\">" + 

        "<a href=\"\/#\/some-link-here-to-add-to-your-list\" class=\"tile-btn_add tile-btn tile-btn_addToList\">" + 

            "ADD TO LIST" + 
        "<\/a>" + 

        "<a href=\"#\" class=\"tile-btn_added tile-btn\">" + 

            "ADDED" + 
        "<\/a>" + 

        "<a href=\"\/#\/some-link-here-to-add-to-shop-now\" class=\"tile-btn_shop tile-btn\">" + 

            "SHOP NOW" + 
        "<\/a>" + 

    "<\/div>" + 

"<\/div>\r\n\t<div class='imageinfo'>Image ID: <%= data.tileimage %><br>Row: <%= data.row %></div><\/div>"
			}