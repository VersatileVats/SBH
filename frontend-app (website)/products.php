<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Openshift | Products</title>

    <!-- blocking the unauthorized ccess -->
    <script>
        if (!window.sessionStorage.getItem("email") && !window.sessionStorage.getItem("pwd")) {
            window.location.href = "./"
        }
    </script>

    <!-- Favicon-->
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
    <!-- Font Awesome icons (free version)-->
    <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
    <!-- Google fonts-->
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css" />
    <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700" rel="stylesheet" type="text/css" />
    <!-- Core theme CSS (includes Bootstrap)-->
    <link href="css/styles.css" rel="stylesheet" />

    <!-- Bootstrap core JS-->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js"></script>
</head>
<body class="bg-light">
    <!-- Footer-->
    <footer class="footer py-4 bg-warning">
        <div class="container">
            <div class="row justify-content-center align-items-center">
                <div class="col-lg-4 text-lg-start text-uppercase" style="font-weight: bold;" id="brandName"></div>
                <div class="col-lg-4 text-lg-end">
                    <a class="link-dark" href="./analytics.php" target="_self">Analytics Page</a>
                </div>
            </div>
        </div>
    </footer>

    <div id="loading" class="flex-column justify-content-center align-items-center" style="width: 90vw; height: 80vh; display: flex; margin: auto;">
        <img src="./assets/loader.svg">
        <h2 id="loadingText">Fetching the products</h2>
    </div>


    <section class="page-section" style="display: none" id="portfolio">
        <div class="container">
            <div class="text-center m-3">
                <h2 class="section-heading text-uppercase">Products</h2>
                <a id="addProductBtn" class="btn btn-primary btn-sm text-uppercase m-3">Add more</a>
            </div>
    
            <!-- form for adding products -->
            <form id="addProductForm" style="display: none; position: relative">
                <div class="row align-items-stretch m-3">
                    <div class="col-md-6 m-auto">
                        <div class="form-group m-2">
                            <input class="form-control" id="productTitle" maxlength="20" type="text" placeholder="Product Name (max 20 characters) *"
                                required />
                        </div>
                        <div class="form-group m-2">
                            <input class="form-control" id="productDesc" type="text" maxlength="20"
                                placeholder="Description (max 20 characters) *" required />
                        </div>
                        <div class="form-group m-2 text-center">
                            <div class="row">
                                <div class="col-md-4 mb-2">
                                    <input class="form-control" id="productPrice" type="number" style="width: 100%;" min="0" required placeholder="Price ($)*">
                                </div>
                                <div class="col-md-4 mb-2">
                                    <select class="form-control" name="gender" id="gender" style="width: 100%;" required>
                                        <option value="default">Target gender*</option>
                                        <option value="everyone">Everyone</option>
                                        <option value="m">Male</option>
                                        <option value="f">Female</option>
                                    </select>
                                </div>
                                <div class="col-md-4 mb-2">
                                    <select class="form-control" name="ageGroup" id="ageGroup" style="width: 100%" required>
                                        <option value="default">Target age group*</option>
                                        <option value="kids">Kids (10-14)</option>
                                        <option value="youth">Youth (15-25)</option>
                                        <option value="adult">Adult (26-50)</option>
                                        <option value="old">Old (50+)</option>
                                        <option value="everyone">For all age groups</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="text-center mt-2">
                             <input type="checkbox" name="productPickup" id="productPickup" required>
                            <label for="productPickup">Available for pickup?</label>
                        </div>
                        <div class="text-center m-2">
                            <input type="file" class="mt-2 m-auto w-100" style="text-align: center" accept="image/*" id="productImage" required>
                        </div>
                        <div class="text-center m-3" style="display: none; font-size: 0.9rem">
                            <div style="display: block">
                                <p>
                                    <img id="delLabel" style="cursor: pointer" width="16" height="16" src="https://img.icons8.com/office/16/delete-sign.png" alt="delete-sign"/>
                                    The image is having a <span id="mlLabel" style="font-weight: bold"></span>
                                </p>    
                            </div>
                            <div style="display:none; text-align: center">
                                <p>If the tag is wrong, then please delete it & write the new one</p>
                                <div class="m-auto text-center w-50">
                                    <input id="newLabel" placeholder="Enter new label" style="display: none; width:100%; text-align: center; margin: auto; border-radius: 2px" maxlength=20></input>
                                </div>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="w-50 m-auto text-center">
                                <input type="submit" id="submitProduct" class="btn btn-primary btn-sm text-uppercase w-100"
                                value="Create Product" style="display: none">
                            </div>
                        </div>
                        <div class="invalid-feedback text-center m-2" id="productError">Product Error</div>
                    </div>
                </div>
            </form>
    
            <!-- product cards will be added -->
            <div class="row" id="productCards">
                
            </div>
        </div>
    </section>
    
    <!--TFJS modules for the Object Detection Methods-->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"> </script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"> </script>
    
    <script>
        let SERVER = "<?php echo getenv("server_url") ?>"
        SERVER = SERVER[SERVER.length - 1] === "/" ? SERVER.slice(0,SERVER.length - 1) : SERVER
        let MODEL = "<?php echo getenv("model_url") ?>"
        MODEL = MODEL[MODEL.length - 1] === "/" ? MODEL.slice(0,MODEL.length - 1) : MODEL
        console.log("Setting up the server variable: " + SERVER + " and model url is: " + MODEL)
    </script>
    <script type="module" src="./js/product.js"></script>
</body>
</html>
