behamics = {
    variables: {
        userStorageKey: "bhm_user",
        cssPreload: !1,
        page: null,
        hostObject: null,
        behamicsApiUrl: "https://engine.behamics.com", //, 
        target: "ochsnersport",
    },

    user: null,
    firstSizeHover: true,
    userIdUpdate: false,
    testCache: false,
    changedLanguage: false,
    alreadyLoadedCategory: false,
    botPattern: "(BingPreview|google|flipboard|crawler|pinkdom|adsbot|googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis|KPS)",

    _randomString: function(len) {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = len;
        var randomstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        return randomstring;
    },

    _addImgClickEvent() {
        document.addEventListener('click', function(event) {
            try {
                if (event.target.closest(".thumbnail--2hmDm")) {
                    var imgUrl = document.querySelector(".container--3vmoP .image--NoOqk").getAttribute("data-src");
                    var timeOutAmount;

                    if (imgUrl == null) {
                        timeOutAmount = 1000;
                    } else {
                        timeOutAmount = 1000;
                    }

                    setTimeout(function() {
                        var payload = {
                            bhmid: null,
                            eventType: "click",
                            eventSource: "imgUrl",
                            data: {
                                "imgUrl": document.querySelector(".container--3vmoP .image--NoOqk").getAttribute("data-src"),
                                "productID": behamics.boxes["Product Page"]._getProduct(null)["productID"],
                            },
                            action: null,
                            getMessage: true
                        }
                        behamics._isDataValid(payload.data)
                        behamics._sendRequestToServer("Product Page", payload);
                    }, timeOutAmount);
                }

            } catch (e) {
                behamics._reportErrorToServer(e, "DOM");
            }

        });
    },

    _addNavigationInterceptor() {
        const constantMock = window.fetch;
        window.fetch = function() {
            return new Promise((resolve, reject) => {
                constantMock.apply(this, arguments)
                    .then((response) => {
                        resolve(response);
                        let lang = behamics._getLanguage().toLowerCase();
                        if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/trusty?context=cart")) {
                            behamics.run();
                        } else if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/content/product/")) {
                            behamics.run();
                        } else if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/content/category/")) {
                            behamics.alreadyLoadedCategory = false;
                            behamics.run();
                        } else if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/content/content/homepage?")) {
                            behamics.run();
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    })
            });
        }
    },

    _conditionalInit() {
        try {
            if ((!behamics._getHostObject())) {

                setTimeout(function() { behamics._conditionalInit(); }, 100);

            } else {

                behamics.init();
            }


        } catch (e) {
            behamics._reportErrorToServer(e);
        }
    }, //-

    _getHostObject: function() {
        try {

            if (typeof digitalData != "undefined" && ((digitalData.page &&
                    digitalData.page.pageInfo.pageID) || (window.dataLayer[0].page && window.dataLayer[0].page.pageInfo.pageID))) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
            behamics._reportErrorToServer(e);
        }
    },

    _getLanguage: function() {
        try {
            if ("page" in digitalData) {
                if (digitalData.page.pageInfo.language == "de") {
                    behamics.variables.target = "ochsnersport";
                    return "DE";
                } else if (digitalData.page.pageInfo.language == "fr") {
                    behamics.variables.target = "ochsnersport_fr";
                    return "FR";
                } else if (digitalData.page.pageInfo.language == "it") {
                    behamics.variables.target = "ochsnersport";
                    return "IT";
                }
            } else {
                if (window.dataLayer[0].page.pageInfo.language == "de") {
                    behamics.variables.target = "ochsnersport";
                    return "DE";
                } else if (window.dataLayer[0].page.pageInfo.language == "fr") {
                    behamics.variables.target = "ochsnersport_fr";
                    return "FR";
                } else if (window.dataLayer[0].page.pageInfo.language == "it") {
                    behamics.variables.target = "ochsnersport";
                    return "IT";
                }
            }
        } catch (e) {
            behamics._reportErrorToServer(e, "DOM");
            return null;
        }
    },

    _findPageType: function() {

        try {
            let pageType;

            if ("page" in digitalData) {
                pageType = digitalData.page.pageInfo.pageID;
            } else {
                pageType = window.dataLayer[0].page.pageInfo.pageID;
            }
            if (pageType == "homepage") {
                return "Home Page";
            }


            if ((pageType == "productList") || (document.querySelectorAll("#searchResultList")[0]) || (document.querySelector("body").className.includes("productListPage"))) {
                return "Product List";
            }


            if (pageType == "productDetails") {
                return "Product Page";
            }


            if (pageType == "cartPage") {
                return "Cart";
            }

            if (window.location.href == "https://www.ochsnersport.ch/" + behamics._getLanguage().toLowerCase() + "/shop/checkout/login") {
                return "Other";
            }


            if (pageType == "checkout-address" || window.location.href.includes("checkout/delivery/address")) {
                return "Delivery Address";
            }


            if (pageType == "multiStepCheckoutSummaryPage") {
                return "Payment";
            }


            if (pageType == "orderConfirmationPage") {

                return "Order Confirmation";

            }


            return document.location.pathname;

        } catch (e) {
            behamics._reportErrorToServer(e);
        }
    }, //-

    _updateUserId: function(changedLanguage = false) {

        try {
            var ttobject = window.dataLayer[0];


            var id = {
                userID: null,
                guest: null,
                cart: [],
                type: null,
                changed: null,
                hasCartChanged: false
            };

            try {
                if ((digitalData.user.profile.attributes.isLoggedIn && digitalData.user.profile.attributes.isLoggedIn != "0") ||
                    (window.dataLayer[0].user && window.dataLayer[0].user.profile.attributes.isLoggedIn &&
                        window.dataLayer[0].user.profile.attributes.isLoggedIn != "0")) {

                    if (behamics._getLanguage() == "FR") {
                        id.userID = digitalData.user.profile.profileInfo.profileID + "FR";
                    } else {
                        id.userID = digitalData.user.profile.profileInfo.profileID;
                    }

                    id.guest = false;

                } else {
                    if (behamics.user.userID == "") {

                        id.userID = behamics._randomString(20); //behamics._randomString(20);

                    } else {

                        if (!behamics.user.guest) {

                            id.userID = behamics._randomString(20);
                        } else {
                            if (changedLanguage) {
                                id.userID = behamics._randomString(20);
                            } else {
                                id.userID = behamics.user.userID;
                            }
                        }
                    }

                    id.guest = true;
                }

                if (behamics.variables.page == "Order Confirmation") //||(behamics.variables.page=="Delivery Address")||(behamics.variables.page=="Payment")){
                {
                    id.hasCartChanged = { "changed": false };
                } else if (changedLanguage) {
                    behamics.user.cart = behamics._parseHostObjectCart();
                    behamics._updateLocalUser();
                    id.cart = behamics.user.cart;
                } else {
                    id.hasCartChanged = behamics._hasCartChanged(id);
                }

            } catch (e) {
                behamics._reportErrorToServer(e);
            }


            if (id.userID != behamics.user.userID) {

                if (id.guest == false) {
                    if (behamics.user.guest) {
                        id.type = "G->RS";
                    } else if (behamics.user.guest == "") {
                        id.type = "NR->R";

                    } else if (!behamics.user.guest) {
                        id.type = "R->R";
                    }

                    behamics.user.guest = id.guest;
                    behamics.user.userID = id.userID;
                    behamics.userIdUpdate = true;

                    id.cart = behamics.user.cart;
                    id.changed = true;

                } else {
                    if (behamics.user.guest === "") {
                        id.type = "NG->G";
                    } else if (behamics.user.guest) {
                        id.type = "G->G";
                    } else if (!behamics.user.guest) {
                        id.type = "R->G";
                    }

                    behamics.user.guest = id.guest;
                    behamics.user.userID = id.userID;
                    behamics.userIdUpdate = true;

                    id.cart = behamics.user.cart;
                    id.changed = true;
                }

            } else if (id.hasCartChanged.changed) {
                id.type = id.hasCartChanged.type;
                id.cart = behamics.user.cart;
                id.changed = true;
            } else {
                id.changed = false;
            }


            delete id.guest;
            delete id.userID;
            delete id.hasCartChanged;

            return id;

        } catch (e) {
            behamics._reportErrorToServer(e);
        }
    }, //-

    _parseHostObjectCart: function() {
        try {
            let localObj;
            if (!("cart" in digitalData)) {
                localObj = window.dataLayer[0].cart.item;
            } else {
                localObj = digitalData.cart.item;
            }

            var tmpCart = [];
            for (var i = 0; i < localObj.length; i++) {

                var price = parseFloat(localObj[i].attributes.price);
                var formerPrice = localObj[i].attributes.originalPrice;

                if (formerPrice == "") {
                    formerPrice = price;
                } else {
                    formerPrice = parseFloat(formerPrice);
                }

                var gender = localObj[i].attributes.gender;

                if (gender == "FEMALE") {
                    gender = "female"
                } else {
                    gender = "male"
                }

                var tempob = {
                    "id": localObj[i].productInfo.productNr,
                    "productID": localObj[i].productInfo.productMasterNr,
                    "name": localObj[i].productInfo.productName.split("+").join(" ").replace("%2f", "/"),
                    "price": price,
                    "amount": parseInt(localObj[i].quantity),
                    "currency": localObj[i].attributes.currency,
                    "formerPrice": formerPrice,
                    "color": localObj[i].attributes.colour,
                    "category": localObj[i].productInfo.defaultCategoryName,
                    "size": localObj[i].productInfo.size,
                    "sizeName": localObj[i].productInfo.size,
                    "url": localObj[i].productInfo.productURL,
                    "imgUrl": localObj[i].productInfo.productImage,
                    "gender": gender
                };

                tmpCart.push(tempob);
            }

            behamics._isDataValid(tmpCart);
            return tmpCart;

        } catch (e) {
            behamics._reportErrorToServer(e, "DOM");
        }

    }, //-

    _hasCartChanged: function(id) {




        try {
            var changed = { "changed": false, "type": "cart:changed" }


            var changed = behamics._compareBehamicsCartWith(behamics._parseHostObjectCart());

            if (changed.changed) {
                behamics.user.cart = behamics._parseHostObjectCart();
                behamics._updateLocalUser();
            }


            return changed;

        } catch (e) {
            behamics._reportErrorToServer(e);
        }





    }, //-

    boxes: {
        run: function(result) {
            if ("control" in result[0]) {

            } else {
                for (var behamicshmivarind = 0; behamicshmivarind < result.length; behamicshmivarind++) {
                    try {
                        html = result[behamicshmivarind]["data"]["html"];
                        code = result[behamicshmivarind]["data"]["code"];
                        id = result[behamicshmivarind]["data"]["inID"];

                        if (typeof result[behamicshmivarind]["data"]["data"] != "undefined") tmpData = result[behamicshmivarind]["data"]["data"];

                        removeID = result[behamicshmivarind]["remove"];

                        var tmpEl = document.createElement('div');

                        tmpEl.innerHTML = html;

                        html = tmpEl.firstChild;

                        if (html) {
                            if ("setAttribute" in html) {

                                html.setAttribute("bhmid", id);
                            }
                        }

                        var elemToRemove = document.querySelectorAll('[bhmid="' + removeID + '"]');

                        if (elemToRemove.length > 0) elemToRemove[0].remove()

                        eval(code);

                    } catch (e) {
                        e.message.evalCode = code
                        behamics._reportErrorToServer(e);
                    }
                }
            }
        },

        "Product List": {
            countRequest: 0,
            changedCategory: false,
            firstID: 0,
            _run: function() {

                ProductList = {
                    "resolvedIDs": [],
                    "IDList": [],
                };


                setTimeout(function() {
                    payload = {
                        bhmid: null,
                        eventType: "load",
                        eventSource: "page",
                        data: { "IDList": behamics.boxes["Product List"]._getListOfProductsIDs(4) },
                        action: null,
                        getMessage: true
                    }

                    behamics._isDataValid(payload.data);
                    if (behamics.alreadyLoadedCategory == false) {
                        behamics.alreadyLoadedCategory = true;
                        behamics._sendRequestToServer(behamics.variables.page, payload);
                    }
                }, 4300);

                // window.addEventListener("click", function(event) {
                //     if (event.target.className == "linkLeaf--399HO" || event.target.className == "linkBranch--1Eb0k") {
                //         behamics.boxes["Product List"].changedCategory = true;
                //     }
                // })

                scrollCount = 0;

                window.addEventListener('scroll', function() {
                    if (scrollCount > 15) {
                        scrollCount = 0;
                        if ("socketID" in behamics) {
                            behamics.boxes["Product List"]._getListOfProductsIDs(2);
                        }
                    }

                    scrollCount = scrollCount + 1;

                });

            },

            _getListOfProductsIDs: function(obj) {

                try {
                    var tmpProductListIDArrays = [];
                    var newIDsToBeResolved = [];

                    var tmpProductList = document.querySelectorAll("section[data-dtm='productTile']");

                    for (i = 0; i < tmpProductList.length; i++) {

                        var tmpID = tmpProductList[i].getAttribute("product-tile");
                        if (ProductList["resolvedIDs"].indexOf(tmpID) == -1 && (typeof tmpID != "undefined")) {
                            if (tmpProductList[i].querySelector(".labelset").childElementCount > 0) {
                                var labelChck = tmpProductList[i].querySelector(".labelset");
                                if ((labelChck.childElementCount = 1 && labelChck.innerHTML.indexOf("neu") !== -1) || (labelChck.childElementCount = 1 && labelChck.innerHTML.indexOf("%") !== -1)) {
                                    if (behamics._onScreen(tmpProductList[i])) {
                                        ProductList["resolvedIDs"].push(tmpID);
                                        newIDsToBeResolved.push(tmpID);
                                    }
                                }
                            } else {
                                if (behamics._onScreen(tmpProductList[i])) {
                                    ProductList["resolvedIDs"].push(tmpID);
                                    newIDsToBeResolved.push(tmpID);
                                }
                            }
                        }

                        tmpProductListIDArrays.push(tmpID);


                    }

                    ProductList["IDList"] = tmpProductListIDArrays;

                    if (obj == 1) {
                        //--------------------------------------------------------------------------
                        //This part gets the list of ids of seen products and sends it to the server



                        var data = {
                            "IDList": newIDsToBeResolved
                        };


                        if (newIDsToBeResolved.length > 0) {
                            return data;
                        } else {
                            return data;
                        }


                    } else if (newIDsToBeResolved.length > 0 && obj == 2) {

                        var data = {
                            "IDList": newIDsToBeResolved
                        };

                        payload = {
                            bhmid: null,
                            eventType: "scroll",
                            eventSource: "page",
                            data: data,
                            action: null,
                            getMessage: true
                        }

                        behamics._sendRequestToServer("Product List", payload);



                        //-----------------------------------------------------------------------------------

                    } else if (obj == 3) {
                        return tmpProductListIDArrays;

                    } else if (obj == 4) {
                        tmpProductListIDArrays.forEach((tmpID) => {
                            if (ProductList["resolvedIDs"].indexOf(tmpID) == -1 && (typeof tmpID != "undefined" || typeof tmpID != null)) {
                                ProductList["resolvedIDs"].push(tmpID);
                            }
                        })
                        return tmpProductListIDArrays;
                    }

                } catch (e) {
                    behamics._reportErrorToServer(e, "DOM");
                }


            },
        },

        "Other": {
            countCartRequests: 0,
            _run: function() {
                payload = {
                    bhmid: null,
                    eventType: "load",
                    eventSource: "page",
                    data: [],
                    action: null,
                    getMessage: true
                }

                behamics._sendRequestToServer("Other", payload);

                const constantMock = window.fetch;
                window.fetch = function() {
                    return new Promise((resolve, reject) => {
                        constantMock.apply(this, arguments)
                            .then((response) => {
                                resolve(response);
                                response.clone().json().then(function(data) {
                                    try {
                                        let lang = behamics._getLanguage().toLowerCase();
                                        if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/trusty?context=cart") &&
                                            behamics.boxes["Other"].countCartRequests == 0 && behamics.variables.page == "Other") {
                                            behamics.boxes["Cart"].countPPRequests = 0;
                                            behamics.boxes["Cart"].countCheckoutRequests = 0;
                                            behamics.boxes["Cart"].countLoginRequests = 0;
                                            behamics.boxes["Other"].countCartRequests++;
                                            behamics.run();
                                        }
                                    } catch (e) {
                                        behamics._reportErrorToServer(e);
                                    }
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                reject(error);
                            })
                    });
                }
            }
        },


        "Home Page": {
            _run: function() {
                ProductList = {
                    "resolvedIDs": [],
                    "IDList": []
                };
                setTimeout(function() {
                    payload = {
                        bhmid: null,
                        eventType: "load",
                        eventSource: "page",
                        data: { "IDList": behamics.boxes["Home Page"]._getListOfProductsIDs(3) },
                        action: null,
                        getMessage: true
                    }

                    behamics._isDataValid(payload.data);
                    behamics._sendRequestToServer(behamics.variables.page, payload);
                }, 5000);
                document.addEventListener('mouseover', function(event) {
                    try {
                        if (event.target.className.includes('logo_default--1P7Qq')) {
                            var payload = {
                                bhmid: null,
                                eventType: "hover",
                                eventSource: "logo",
                                data: [],
                                action: null,
                                getMessage: behamics.firstSizeHover
                            }
                            behamics._isDataValid(payload.data)
                            behamics._sendRequestToServer(behamics.variables.page, payload);
                            behamics.firstSizeHover = false;
                        }
                    } catch (e) {
                        behamics._reportErrorToServer(e, "DOM");
                    }
                });

            },

            _getListOfProductsIDs: function(obj) {
                try {
                    var tmpProductListIDArrays = [];
                    var newIDsToBeResolved = [];
                    var link = document.querySelectorAll(".dy-recommendations__slider.dy-recommendations__slider-horizontal");

                    for (var i = 0; i < link.length; i++) {
                        var tmpProductList = [...link[i].querySelectorAll(".dy-recommendation-product:not(.swiper-slide-duplicate)")].slice(0, 6);

                        if (tmpProductList) {
                            for (j = 0; j < tmpProductList.length; j++) {
                                var tmOut = tmpProductList[j].getAttribute("href").split("-");
                                var tmpCount = tmOut[tmOut.length - 2];
                                var tmpID;
                                if (tmpCount.length > 14) {
                                    tmpID = tmpCount.slice(0, -8);
                                } else {
                                    tmpID = tmpCount;
                                }

                                if (
                                    ProductList['resolvedIDs'].indexOf(tmpID) == -1 &&
                                    typeof tmpID != 'undefined' &&
                                    tmpID != null
                                ) {
                                    if (behamics._onScreen(tmpProductList[j])) {
                                        ProductList['resolvedIDs'].push(tmpID);
                                        newIDsToBeResolved.push(tmpID);
                                    }
                                }

                                tmpProductListIDArrays.push(tmpID);
                            }
                        }
                    }

                    ProductList["IDList"] = tmpProductListIDArrays;

                    if (obj == 1) {
                        var data = {
                            "IDList": newIDsToBeResolved
                        };
                        if (newIDsToBeResolved.length > 0) {
                            return data;
                        } else {
                            return data;
                        }

                    } else if (newIDsToBeResolved.length > 0 && obj == 2) {

                        var data = {
                            "IDList": newIDsToBeResolved
                        };
                        payload = {
                            bhmid: null,
                            eventType: "scroll",
                            eventSource: "page",
                            data: data,
                            action: null,
                            getMessage: true
                        }
                        behamics._sendRequestToServer("Home Page", payload);

                    } else if (obj == 3) {
                        return tmpProductListIDArrays;
                    }

                } catch (e) {
                    behamics._reportErrorToServer(e, "DOM");
                }


            },

        },

        "My Account": {
            _run: function() {
                payload = {
                    bhmid: null,
                    eventType: "load",
                    eventSource: "page",
                    data: [],
                    action: null,
                    getMessage: true
                }

                behamics._sendRequestToServer(behamics.variables.page, payload);
            }
        },

        "Delivery Address": {
            countRequests: 0,
            countCartRequests: 0,
            _run: function() {
                payload = {
                    bhmid: null,
                    eventType: "load",
                    eventSource: "page",
                    data: [],
                    action: null,
                    getMessage: true
                }

                behamics._sendRequestToServer(behamics.variables.page, payload);

                const constantMock = window.fetch;
                window.fetch = function() {
                    return new Promise((resolve, reject) => {
                        constantMock.apply(this, arguments)
                            .then((response) => {
                                resolve(response);
                                response.clone().json().then(function(data) {

                                    try {
                                        let lang = behamics._getLanguage().toLowerCase();
                                        if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/content/other/checkout_summary") &&
                                            behamics.boxes["Delivery Address"].countRequests == 0 && behamics.variables.page == "Delivery Address") {
                                            behamics.run();
                                            behamics.boxes["Payment"].countRequests = 0;
                                        } else if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/trusty?context=cart") &&
                                            behamics.boxes["Delivery Address"].countCartRequests == 0 && behamics.variables.page == "Delivery Address") {
                                            behamics.boxes["Delivery Address"].countCartRequests++;
                                            behamics.boxes["Cart"].countCheckoutRequests = 0;
                                            behamics.boxes["Cart"].countRequests = 0;
                                            behamics.boxes["Cart"].countPPRequests = 0;
                                            behamics.run();
                                        }

                                    } catch (e) {
                                        behamics._reportErrorToServer(e);
                                    }
                                });
                            })
                            .catch((error) => {
                                reject(error);
                            })
                    });
                }

                document.addEventListener('submit', (e) => {


                        if (e.target.closest("form").getAttribute("name") == "addressForm") {
                            var address = behamics.boxes["Delivery Address"]._getDeliveryAddress();

                            if (address) {

                                payload = {
                                    bhmid: null,
                                    eventType: "click",
                                    eventSource: "add",
                                    data: address,
                                    action: "address:add",
                                    getMessage: false
                                }
                                behamics._isDataValid(payload.data);
                                behamics._sendRequestToServer(behamics.variables.page, payload);
                            }

                        }
                    }

                );

            },

            _getDeliveryAddress: function() {
                try {
                    var address = {
                        "firstName": "",
                        "lastName": "",
                        "address": document.querySelector("#register_line1").value,
                        "zip": document.querySelector("#postcode").value,
                        "city": document.querySelector("#townCity   ").value,
                        "country": document.querySelector("#register_country").value,
                        "phone": "",
                    };

                    if (digitalData.user.profile.attributes.isLoggedIn != "0") {
                        address["email"] = digitalData.user.profile.profileInfo.email;
                    } else {
                        address["email"] = document.querySelector("#register_email").value;
                    }

                    if (document.querySelector("#register_title").value = "mr") {
                        address["gender"] = "male";
                    } else if (document.querySelector("#register_title").value == "mrs") {
                        address["gender"] = "female";
                    } else {
                        address["gender"] = document.querySelector("#register_title").value;
                    }

                    behamics._isDataValid(address);
                    return { "billing": address };

                } catch (e) {
                    behamics._reportErrorToServer(e, "DOM");
                }

            }
        }, //-

        "Shipping Method": {
            _run: function() {

                payload = {
                    bhmid: null,
                    eventType: "load",
                    eventSource: "page",
                    data: [],
                    action: null,
                    getMessage: true
                }

                behamics._sendRequestToServer(behamics.variables.page, payload);




            },

        },

        "Payment": {
            countRequests: 0,
            _run: function() {
                payload = {
                    bhmid: null,
                    eventType: "load",
                    eventSource: "page",
                    data: [],
                    action: null,
                    getMessage: true
                }

                behamics._sendRequestToServer("Payment", payload);

                const constantMock = window.fetch;
                window.fetch = function() {
                    return new Promise((resolve, reject) => {
                        constantMock.apply(this, arguments)
                            .then((response) => {
                                resolve(response);
                                response.clone().json().then(function(data) {

                                    try {
                                        let lang = behamics._getLanguage().toLowerCase();
                                        if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/content/other/checkout_delivery_address") &&
                                            behamics.boxes["Payment"].countRequests == 0 && behamics.variables.page == "Payment") {
                                            behamics.run();
                                            behamics.boxes["Delivery Address"].countCartRequests = 0;
                                            behamics.boxes["Delivery Address"].countRequests = 0;
                                            behamics.boxes["Payment"].countRequests++;
                                        }

                                    } catch (e) {
                                        behamics._reportErrorToServer(e);
                                    }
                                });
                            })
                            .catch((error) => {
                                reject(error);
                            })
                    });
                }

            },

        },

        "All Pages": {
            _run: function() {

                window.onbeforeunload = function(event) {
                    navigator.sendBeacon(behamics.variables.behamicsApiUrl + '/api/disconnect', JSON.stringify({
                        "tempSessionID": behamics._getTempSession(false)["behtempid"],
                        "socketID": behamics.socketID,
                        "target": behamics.variables.target
                    }));

                };


            },

        },

        "Cart": {
            prdTCCount: 0,
            prdRmCount: 0,
            countCheckoutRequests: 0,
            countLoginRequests: 0,
            _run: function() {
                try {

                    payload = {
                        bhmid: null,
                        eventType: "load",
                        eventSource: "page",
                        data: [],
                        action: null,
                        getMessage: true
                    }

                    behamics._sendRequestToServer("Cart", payload);


                    const constantMock = window.fetch;
                    window.fetch = function() {
                        return new Promise((resolve, reject) => {
                            constantMock.apply(this, arguments)
                                .then((response) => {

                                    resolve(response);
                                    response.clone().json().then(function(data) {

                                        try {
                                            let lang = behamics._getLanguage().toLowerCase();
                                            if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/content/other/checkout_summary") &&
                                                behamics.boxes["Cart"].countCheckoutRequests == 0 && behamics.variables.page == "Cart") {
                                                behamics.run();
                                                behamics.boxes["Payment"].countRequests = 0;
                                                behamics.boxes["Cart"].countCheckoutRequests++;
                                            } else if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/content/other/checkout_login?full=false") &&
                                                behamics.boxes["Cart"].countLoginRequests == 0 && behamics.variables.page == "Cart") {
                                                behamics.run();
                                                behamics.boxes["Other"].countCartRequests = 0;
                                                behamics.boxes["Cart"].countLoginRequests++;
                                            } else if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/content/other/checkout_delivery_address") &&
                                                behamics.boxes["Cart"].countCheckoutRequests == 0 && behamics.variables.page == "Cart") {
                                                behamics.run();
                                                behamics.boxes["Delivery Address"].countCartRequests = 0;
                                                behamics.boxes["Delivery Address"].countRequests = 0;
                                                behamics.boxes["Cart"].countCheckoutRequests++;
                                            } else if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/cart/product/modify?") &&
                                                behamics.boxes["Cart"].prdTCCount < dataLayer.filter(obj => obj.event == "eec.add").length &&
                                                behamics.variables.page == "Cart") {
                                                behamics.boxes["Cart"].prdTCCount = dataLayer.filter(obj => obj.event == "eec.add").length;

                                                var event = dataLayer.filter(obj => obj.event == "eec.add").pop();
                                                var tmpPrd = behamics._findProductInLocalCart(event.ecommerce.add.products[0].variant);

                                                var quantity = parseInt(event.ecommerce.add.products[0].quantity)


                                                if (tmpPrd) {


                                                    var oldValue = tmpPrd["amount"];
                                                    var newValue = quantity + oldValue;




                                                    data = {

                                                        "amount": quantity,
                                                        "newValue": newValue,
                                                        "id": tmpPrd.id
                                                    };

                                                    payload = {
                                                        bhmid: null,
                                                        eventType: "select",
                                                        eventSource: "Amount",
                                                        data: data,
                                                        action: "product:increase",
                                                        getMessage: false
                                                    };

                                                    behamics._isDataValid(payload.data);
                                                    behamics._increasDecreaseProductInLocalCart(tmpPrd.id, newValue);
                                                    behamics._sendRequestToServer(behamics.variables.page, payload);

                                                }

                                            } else if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/cart/product/modify?") &&
                                                behamics.boxes["Cart"].prdRmCount < dataLayer.filter(obj => obj.event == "eec.remove").length &&
                                                behamics.variables.page == "Cart") {

                                                behamics.boxes["Cart"].prdRmCount = dataLayer.filter(obj => obj.event == "eec.remove").length;

                                                var event = dataLayer.filter(obj => obj.event == "eec.remove").pop();
                                                var tmpPrd = behamics._findProductInLocalCart(event.ecommerce.remove.products[0].variant);

                                                var quantity = parseInt(event.ecommerce.remove.products[0].quantity)

                                                var oldValue = tmpPrd["amount"];

                                                if (tmpPrd) {
                                                    if (oldValue != quantity) {


                                                        var newValue = oldValue - quantity;



                                                        var data = {

                                                            "amount": quantity,
                                                            "newValue": newValue,
                                                            "id": tmpPrd.id
                                                        };

                                                        payload = {
                                                            bhmid: null,
                                                            eventType: "select",
                                                            eventSource: "Amount",
                                                            data: data,
                                                            action: "product:decrease",
                                                            getMessage: false
                                                        };
                                                        behamics._isDataValid(payload.data);
                                                        behamics._increasDecreaseProductInLocalCart(tmpPrd.id, newValue);
                                                        behamics._sendRequestToServer(behamics.variables.page, payload);

                                                    } else {

                                                        var data = {
                                                            "id": tmpPrd.id
                                                        };

                                                        var payload = {
                                                            bhmid: null,
                                                            eventType: "click",
                                                            eventSource: "Remove",
                                                            data: data,
                                                            action: "cart:remove",
                                                            getMessage: false
                                                        };
                                                        behamics._isDataValid(payload.data);
                                                        behamics._sendRequestToServer(behamics.variables.page, payload);
                                                        behamics._removeProductInLocalCart(tmpPrd.id);


                                                    }
                                                }

                                            }

                                        } catch (e) {
                                            behamics._reportErrorToServer(e, "DOM");
                                        }

                                    });


                                })
                                .catch((error) => {
                                    reject(error);
                                })
                        });
                    }
                } catch (e) {
                    behamics._reportErrorToServer(e, "DOM");
                }

            },



        },

        "Product Page": {
            prdTCCount: 0,
            countCartRequests: 0,
            countPLRequests: 0,
            countHover: 0,
            countHPRequests: 0,
            _run: function() {

                payload = {
                    bhmid: null,
                    eventType: "load",
                    eventSource: "page",
                    data: behamics.boxes["Product Page"]._getProduct(null),
                    action: null,
                    getMessage: true
                }

                behamics._isDataValid(payload.data);
                behamics._sendRequestToServer("Product Page", payload);


                const constantMock = window.fetch;
                window.fetch = function() {
                    return new Promise((resolve, reject) => {
                        constantMock.apply(this, arguments)
                            .then((response) => {

                                resolve(response);



                                response.clone().json().then(function(data) {

                                    try {
                                        let lang = behamics._getLanguage().toLowerCase();
                                        if (response.url.includes("https://www.ochsnersport.ch/" + lang + "/shop/api/v2/cart/product?")) {
                                            if (behamics.boxes["Product Page"].prdTCCount < dataLayer.filter(obj => obj.event == "eec.add").length) {

                                                behamics.boxes["Product Page"].prdTCCount = dataLayer.filter(obj => obj.event == "eec.add").length;

                                                var data = behamics.boxes["Product Page"]._getProduct(null);

                                                payload = {
                                                    bhmid: null,
                                                    eventType: "click",
                                                    eventSource: "add",
                                                    data: data,
                                                    action: "cart:add",
                                                    getMessage: true
                                                }

                                                behamics._isDataValid(payload.data)
                                                behamics._addProductToLocalCart(data);
                                                behamics._sendRequestToServer("Product Page", payload);
                                            }
                                        }
                                    } catch (e) {
                                        behamics._reportErrorToServer(e, "DOM");
                                    }

                                });


                                // do something for specificconditions

                            })
                            .catch((error) => {
                                console.log(error);
                                reject(error);
                            })
                    });
                }


                document.addEventListener('mouseover', function(event) {
                    try {
                        if (event.target.closest(".size") && behamics.boxes["Product Page"].countHover == 0) {

                            var payload = {
                                bhmid: null,
                                eventType: "hover",
                                eventSource: "size",
                                data: { "sizeName": event.target.closest(".size").getAttribute("kps-test-id").split("-")[1], "productID": behamics.boxes["Product Page"]._getProduct(null)["productID"] },
                                action: null,
                                getMessage: behamics.firstSizeHover
                            }
                            behamics._isDataValid(payload.data)
                            behamics._sendRequestToServer("Product Page", payload);
                            behamics.firstSizeHover = false;
                            behamics.boxes["Product Page"].countHover++;
                        }

                    } catch (e) {
                        behamics._reportErrorToServer(e, "DOM");
                    }

                });

            
                
            },

            _getProduct: function(data) {




                try {

                    var completeProductCategory = digitalData.product.category.productCategoryI;
                    if (digitalData.product.category.productCategoryII !== '') {
                        completeProductCategory = completeProductCategory + "/" + digitalData.product.category.productCategoryII;
                    }
                    if (digitalData.product.category.productCategoryIII !== '') {
                        completeProductCategory = completeProductCategory + "/" + digitalData.product.category.productCategoryIII;
                    }
                    if (digitalData.product.category.productCategoryIV !== '') {
                        completeProductCategory = completeProductCategory + "/" + digitalData.product.category.productCategoryIV;
                    }
                    
                    var variantColors = document.querySelectorAll('.color');
                    var colors = []
                    if (variantColors.length !== 0 ) {
                        variantColors.forEach(element => {
                            var alt = element.alt.split(' ');
                            colors.push(alt[alt.length - 1])
                        });
                    }
                    

                    if (data) {
                        var price = parseFloat(data.product.attributes.price);
                        var formerPrice = data.product.attributes.originalPrice;

                        if (formerPrice == "") {
                            formerPrice = price;
                        } else {
                            formerPrice = parseFloat(formerPrice);
                        }

                        var gender = digitalData.product.attributes.gender;

                        if (gender == "FEMALE") {
                            gender = "female"
                        } else {
                            gender = "male"
                        }

                        var tempob = {
                            "id": data.product.productInfo.productNr,
                            "productID": data.product.productInfo.productMasterNr,
                            "name": digitalData.product.productInfo.productName.split("+").join(" ").replace("%2f", "/"),
                            "price": price,
                            "amount": 1,
                            "currency": digitalData.product.attributes.currency,
                            "formerPrice": formerPrice,
                            "color": data.product.attributes.colour,
                            "category": completeProductCategory,
                            "size": data.product.productInfo.size,
                            "sizeName": data.product.productInfo.size,
                            "url": window.location["href"],
                            "imgUrl": digitalData.product.productInfo.productImage,
                            "gender": gender,
                            "variantColors": colors
                        };
                    } else {


                        var price = parseFloat(digitalData.product.attributes.price);
                        var formerPrice = digitalData.product.attributes.originalPrice;

                        if (formerPrice == "") {
                            formerPrice = price;
                        } else {
                            formerPrice = parseFloat(formerPrice);
                        }

                        var gender = digitalData.product.attributes.gender;

                        if (gender == "FEMALE") {
                            gender = "female"
                        } else {
                            gender = "male"
                        }


                        var tempob = {
                            "id": digitalData.product.productInfo.productNr,
                            "productID": digitalData.product.productInfo.productMasterNr,
                            "name": digitalData.product.productInfo.productName.split("+").join(" ").replace("%2f", "/"),
                            "price": price,
                            "amount": 1,
                            "currency": digitalData.product.attributes.currency,
                            "formerPrice": formerPrice,
                            "color": digitalData.product.attributes.colour,
                            "category": completeProductCategory,
                            "size": digitalData.product.productInfo.size,
                            "sizeName": digitalData.product.productInfo.size,
                            "url": window.location["href"],
                            "imgUrl": digitalData.product.productInfo.productImage,
                            "gender": gender, 
                            "variantColors": colors

                        };
                        if (digitalData.product.productInfo.variantStockSum == "0") {
                            tempob["availability"] = 'out of stock';
                        }

                    }



                    return tempob;

                } catch (e) {
                    behamics._reportErrorToServer(e, "DOM");
                }


            },


        },

        "Order Confirmation": {
            _run: function() {
                try {
                    var orderInfo = behamics.boxes["Order Confirmation"]._getOrderId();


                    payload = {
                        bhmid: null,
                        eventType: "load",
                        eventSource: "page",
                        data: orderInfo,
                        action: "cart:checkout",
                        getMessage: true
                    };

                    behamics._isDataValid(payload.data);
                    behamics._sendRequestToServer(behamics.variables.page, payload);

                    behamics.user.cart = [];
                    behamics._updateLocalUser();


                } catch (e) {
                    behamics._reportErrorToServer(e, "DOM");
                }

            },

            _getOrderId: function() {
                try {
                    return {
                        "orderID": digitalData.transaction.transactionID,
                        "paymentMethod": digitalData.transaction.attributes.paymentMethod,
                        "shippingCosts": parseFloat(digitalData.transaction.attributes.deliveryFee)
                    };
                } catch (e) {
                    behamics._reportErrorToServer(e, "DOM");
                }
            }
        }, //-



    },




    _compareBehamicsCartWith: function(cart) {
        try {
            if (behamics.user.cart.length != cart.length) {
                return { "changed": true, "type": "cart:changed" }
            }

            for (var i = 0; i < behamics.user.cart.length; i++) {
                var tmpRes = cart.find(obj => (obj.id == behamics.user.cart[i].id) && (obj.amount == behamics.user.cart[i].amount));

                if (tmpRes == null) {
                    return { "changed": true, "type": "cart:changed" }

                }

                if (tmpRes.price != behamics.user.cart[i].price) {
                    return { "changed": true, "type": "cart:pricesChanged" }

                }


            }

            return { "changed": false }

        } catch (e) {
            behamics._reportErrorToServer(e);
        }

    },

    _changeProductSizeInLocalCart(data) {
        try {
            var tmpIndx = behamics._findProductIndexInLocalCart(data.newID);

            var oldPrd = behamics._findProductInLocalCart(data.oldID);
            var oldIndex = behamics._findProductIndexInLocalCart(data.oldID);

            if (tmpIndx > -1) {
                behamics.user.cart[tmpIndx].amount = behamics.user.cart[tmpIndx].amount + oldPrd.amount;
            } else {
                oldPrd.sizeName = data.newSizeName;
                oldPrd.size = data.newSize;
                oldPrd.id = data.newID;

                behamics.user.cart.push(oldPrd);

            }

            oldIndex = behamics._findProductIndexInLocalCart(data.oldID)
            behamics.user.cart.splice(oldIndex, 1);

            behamics._updateLocalUser();

        } catch (e) {
            behamics._reportErrorToServer(e);
        }
    },

    _onScreen: function(elem) {
        try {
            var docViewTop = window.scrollY || window.scrollTop || document.getElementsByTagName("html")[0].scrollTop;
            var docViewBottom = docViewTop + window.innerHeight;

            var elemTop = behamics.offset(elem).top;
            var elemBottom = elemTop + elem.offsetHeight;

            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        } catch (e) {
            behamics._reportErrorToServer(e);
        }
    },

    offset: function(el) {
        try {
            var rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return { top: rect.top + scrollTop, left: rect.left + scrollLeft }

        } catch (e) {
            behamics._reportErrorToServer(e);
        }
    },

    _removeProductInLocalCart(prdId) {
        try {
            var tmpIndx = behamics._findProductIndexInLocalCart(prdId);

            if (tmpIndx > -1) {
                behamics.user.cart.splice(tmpIndx, 1);
            }

            behamics._updateLocalUser();

        } catch (e) {
            behamics._reportErrorToServer(e);
        }
    },

    _findProductIndexInLocalCart(id) {
        try {
            var tmpObj = behamics.user.cart.find(o => o.id === id);
            var tmpIndx = behamics.user.cart.indexOf(tmpObj);
            return tmpIndx;

        } catch (e) {
            behamics._reportErrorToServer(e);
        }
    },

    _findProductInLocalCart(id) {
        try {
            var tmpObj = behamics.user.cart.find(o => o.id === id);

            if (typeof tmpObj != "undefined") {
                return tmpObj;
            } else {
                return null;
            }

        } catch (e) {
            behamics._reportErrorToServer(e);
        }
    },

    _addProductToLocalCart(prd) {
        try {
            var tmpIndx = behamics._findProductIndexInLocalCart(prd["id"]);

            if (tmpIndx == -1) {
                behamics.user.cart.push(prd);
            } else {
                behamics.user.cart[tmpIndx].amount = behamics.user.cart[tmpIndx].amount + 1;
            }

            behamics._updateLocalUser();

        } catch (e) {
            behamics._reportErrorToServer(e);
        }

    },

    _increasDecreaseProductInLocalCart(prdId, newValue) {
        try {
            var tmpIndx = behamics._findProductIndexInLocalCart(prdId);

            if (tmpIndx > -1) {
                if (newValue == 0) {
                    behamics.user.cart.splice(tmpIndx, 1);
                } else {
                    behamics.user.cart[tmpIndx].amount = newValue;
                }
            }

            behamics._updateLocalUser();

        } catch (e) {
            behamics._reportErrorToServer(e);
        }
    },

    _updateLocalUser() {
        try {
            localStorage.setItem(behamics.variables.userStorageKey, JSON.stringify(behamics.user));
        } catch (e) {
            behamics._reportErrorToServer(e);
        }

    },

    _getCartTotalItems() {
        try {
            var total = 0;
            for (var i = 0; i < behamics.user.cart.length; i++) {
                total = total + behamics.user.cart[i].amount;
            }

            return total;
        } catch (e) {
            behamics._reportErrorToServer(e);
        }

    },

    _getLocalUser() {
        var user = JSON.parse(localStorage.getItem(behamics.variables.userStorageKey));

        if (!user) {
            user = {
                userID: "",
                sessionID: "",
                guest: "",
                globalControl: "",
                cart: []
            };
        } else {
            if (!("userID" in user)) {
                user.userID = ""
            }

            if (!("sessionID" in user)) {
                user.sessionID = ""
            }

            if (!("guest" in user)) {
                user.guest = ""
            }

            if (!("cart" in user)) {
                user.cart = ""
            }

            if (!("globalControl" in user)) {
                user.globalControl = ""
            }
        }

        behamics.user = user;
    },

    _isDataValid: function(data) {
        try {
            if (data == null) {
                throw new Error("INVALID_DATA Error - data is null or undefined");
            } else if (typeof data === "object") {
                Object.keys(data).forEach((key, index) => {
                    const dataField = data[key];
                    const dataFieldArray = data;
                    if (Array.isArray(dataField)) {
                        if (dataField.length > 0 && dataField != null) {
                            dataField.forEach((el, i) => {
                                if (el == null) {
                                    throw new Error("INVALID_DATA Error - " + key + " has null elements");
                                }
                            });
                        } else {
                            throw new Error("INVALID_DATA Error - " + key + " is empty");
                        }
                    }
                    if (Array.isArray(dataFieldArray)) {
                        if (dataFieldArray.length > 0 && dataFieldArray != null) {
                            dataFieldArray.forEach((el, i) => {
                                behamics._isDataValid(el);
                            });
                        }
                    } else if (key !== "imgUrl") {
                        if (dataField == null) {
                            throw new Error("INVALID_DATA Error - " + key + " is null or undefined");
                        }
                    }
                });
            }
        } catch (e) {
            behamics._reportErrorToServer(e, "INVALID_DATA");
            return false;
        }
        return true;
    },

    _reportErrorToServer: function(payload, errorType) {
        var finalFormat = {
            tempSessionID: behamics._getTempSession()["behtempid"],
            error: { "message": payload.message, "stack": payload.stack },
            type: errorType,
            page: behamics.variables.page,
            location: window.location.href,
            target: behamics.variables.target,
            referrer: document.referrer.substring(0, 300),

        }


        if (localStorage.getItem("bhmfrombhm") != null) {
            finalFormat.fromBhm = true;
        }

        if ("socketID" in behamics) {
            finalFormat.socketID = behamics.socketID;
        }

        if ("sessionID" in behamics) {
            finalFormat.sessionID = behamics.user.sessionID;
        }

        if ("globalControl" in behamics) {
            finalFormat.globalControl = behamics.user.globalControl;
        }

        if ("userID" in behamics) {
            finalFormat.socketID = behamics.user.userID;
        }

        if ("guest" in behamics) {
            finalFormat.socketID = behamics.user.guest;
        }

        var xhr = new XMLHttpRequest();
        if (errorType) {
            xhr.open('POST', behamics.variables.behamicsApiUrl + '/api/clienterrors?target=' + behamics.variables.target + "&type=" + errorType);
        } else {
            xhr.open('POST', behamics.variables.behamicsApiUrl + '/api/clienterrors?target=' + behamics.variables.target);
        }
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.onload = function() {


        };

        xhr.send(JSON.stringify(finalFormat));


    },

    _sendRequestToServer: function(page, payload) {

        var finalFormat = {
            tempSessionID: behamics._getTempSession()["behtempid"],
            payload: payload,
            page: page,
            lang: behamics._getLanguage(),
            location: window.location.href,
            target: behamics.variables.target,
            referrer: document.referrer.substring(0, 300),
            sessionID: behamics.user.sessionID,
            globalControl: behamics.user.globalControl
        };

        if ((finalFormat.payload.eventType == "load") && (finalFormat.payload.eventSource == "page")) {
            finalFormat.user = behamics._updateUserId(behamics.changedLanguage);
            if (behamics.changedLanguage) {
                finalFormat.sessionID = "";
            }
        }

        if (localStorage.getItem("bhmfrombhm") != null) {
            finalFormat.fromBhm = true;
        }

        if ("socketID" in behamics) {
            finalFormat.socketID = behamics.socketID;
        }

        if ('availability' in finalFormat.payload.data) {
            finalFormat['availability'] = finalFormat.payload.data.availability;
        }


        finalFormat.userID = behamics.user.userID;
        finalFormat.guest = behamics.user.guest;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', behamics.variables.behamicsApiUrl + "/api/getmessage");
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.onload = function() {
            try {
                if (xhr.status == 200) {
                    var data = JSON.parse(xhr.response);

                    if (typeof(data.incentives) != undefined && data.incentives.length > 0) {
                        behamics.boxes.run(data.incentives);
                    }

                    if (behamics.changedLanguage) {
                        behamics.changedLanguage = false;
                    }
                    if ("user" in data) {
                        if (behamics.userIdUpdate == true) {
                            behamics._updateLocalUser();
                            behamics.userIdUpdate = false;
                        }
                        if (data.user.update) {
                            behamics.user.cart = data.user.cart;
                            behamics.user.userID = data.user.userID;
                            behamics._updateLocalUser();
                        }




                        if (data.user.updateS) {
                            behamics.user.sessionID = data.user.sessionID;
                            behamics.user.globalControl = data.user.globalControl;
                            behamics._updateLocalUser();
                        }

                        if (data.user.type == "G->RS") {
                            earlycodeWishListData = JSON.parse(sessionStorage.getItem("earlycodeWishListData"));
                            if (earlycodeWishListData != null) {
                                eval(sessionStorage.getItem("earlycodeWishListCode"));
                            }
                            sessionStorage.removeItem("earlycodeWishListData");
                            sessionStorage.removeItem("earlycodeWishListCode")
                        }
                    }
                }
            } catch (e) {
                behamics._reportErrorToServer(e);
            }

        };

        xhr.send(JSON.stringify(finalFormat));



    },

    _loadCSS: function(e, t) {
        var n = document.createElement("link");
        return n.type = "text/css", behamics.variables.cssPreload ? (n.rel = "preload", n.as = "style") : n.rel = "stylesheet", n.media = "screen", t && "function" == typeof t && (void 0 !== n.onreadystatechange ? n.onreadystatechange = function() {
            "loaded" !== this.readyState && "complete" !== this.readyState || (t(), n.onreadystatechange = null)
        } : n.onload = t), n.href = e, document.getElementsByTagName("head")[0].appendChild(n), n
    },

    _createNewTempSession: function() {
        let tempSession = {};
        tempSession["behtempid"] = behamics._randomString(30);
        tempSession["creationDate"] = new Date();
        tempSession["behpageid"] = null;
        tempSession["language"] = behamics._getLanguage();
        localStorage.setItem('tempSession', JSON.stringify(tempSession));
        return tempSession;
    },

    _getTempSession: function(checkDate = true) {
        var tempSession = JSON.parse(localStorage.getItem('tempSession'))

        if (tempSession == null) {
            tempSession = {};
            tempSession["behtempid"] = behamics._randomString(30);
            tempSession["creationDate"] = new Date();
            tempSession["language"] = behamics._getLanguage();
        }

        if (tempSession["language"] != behamics._getLanguage()) {
            tempSession = behamics._createNewTempSession();
            behamics.changedLanguage = true;
            return tempSession;
        }

        if (tempSession["creationDate"] == null) {
            tempSession["creationDate"] = new Date()
            localStorage.setItem('tempSession', JSON.stringify(tempSession));
        }

        var newDate = new Date();
        var diff = Math.abs(newDate - new Date(tempSession["creationDate"]));
        var minutes = Math.floor((diff / 1000) / 60);

        if (minutes > 30 && checkDate) {
            tempSession["behtempid"] = behamics._randomString(30);
            tempSession["creationDate"] = new Date()
            tempSession["behpageid"] = null;
            tempSession["language"] = behamics._getLanguage();
            localStorage.setItem('tempSession', JSON.stringify(tempSession))
        } else if (checkDate) {
            tempSession["creationDate"] = new Date()
            localStorage.setItem('tempSession', JSON.stringify(tempSession))
        }

        return tempSession;
    },

    _increasePageID: function() {
        var tempSessionID = behamics._getTempSession();

        if (tempSessionID.behpageid == null) {
            tempSessionID.behpageid = 1;
        } else {
            tempSessionID.behpageid = parseInt(tempSessionID.behpageid);
            tempSessionID.behpageid++;
        }

        localStorage.setItem('tempSession', JSON.stringify(tempSessionID));

        return tempSessionID.behpageid + '';
    },

    _getEarlyCodeToBeExecuted() {
        var value = sessionStorage.getItem("earlycode");

        if (value != null && value != "") {
            eval(value);
            sessionStorage.setItem("earlycode", "");
        }

        return value;
    },

    _setEarlyCodeToBeExecuted(value) {
        sessionStorage.setItem("earlycode", value)
    },

    init: function() {
        try {


            var re = new RegExp(behamics.botPattern, 'i');
            if (!re.test(navigator.userAgent)) {
                behamics._loadCSS("https://cdn.behamics.com/ochsnersport/behamics.css");
                behamics.run();
            }


        } catch (e) {
            behamics._reportErrorToServer(e);
            return null;
        }
    },

    _runPages: function() {
        behamics.boxes["All Pages"]._run();

        switch (behamics.variables.page) {
            case "Cart":
                behamics.boxes["Cart"]._run();
                break;

            case "Shipping Method":
                behamics.boxes["Shipping Method"]._run();
                break;

            case "Payment":
                behamics.boxes["Payment"]._run();
                break;

            case "Product Page":
                behamics.boxes["Product Page"]._run();
                break;

            case "Order Confirmation":
                behamics.boxes["Order Confirmation"]._run();
                break;

            case "Delivery Address":
                behamics.boxes["Delivery Address"]._run();
                break;

            case "Product List":
                behamics.boxes["Product List"]._run();
                break;

            case "My Account":
                behamics.boxes["My Account"]._run();
                break;

            case "Home Page":
                behamics.boxes["Home Page"]._run();
                break;

            case "Wishlist":
                behamics.boxes["Wishlist"]._run();
                break;

            default:
                behamics.boxes["Other"]._run();
                break;
        }


    },

    run: function() {
        try {
            if (!behamics._getHostObject()) {
                setTimeout(function() { behamics.run(); }, 100);
            } else {
                behamics.variables.page = behamics._findPageType();

                behamics._getEarlyCodeToBeExecuted();

                behamics._getLocalUser();

                behamics.socketID = behamics._increasePageID();

                behamics._runPages();

            }
        } catch (e) {
            behamics._reportErrorToServer(e);
        }
    }
}

behamics._conditionalInit();
behamics._addNavigationInterceptor();
behamics._addImgClickEvent();