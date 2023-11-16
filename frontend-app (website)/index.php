<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Openshift | Home</title>

        <script>
            if (window.sessionStorage.getItem("email") && window.sessionStorage.getItem("pwd")) {
                window.location.href = "./products.php"
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
    </head>
    
    <body id="page-top" style="position: relative;">
        <!-- Navigation-->
        <nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
            <div class="container">
                <a class="navbar-brand" href="#page-top">Openshift Hub</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    Menu
                    <i class="fas fa-bars ms-1"></i>
                </button>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
                        <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>
                        <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                        <li class="nav-item"><a class="nav-link" href="#login">Login</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        
        <!-- Masthead-->
        <header class="masthead d-flex flex-column justify-content-center align-items-center" style="height: 100vh;">
            <div class="container">
                <div class="masthead-subheading">Where shops transform to brands</div>
                <div class="masthead-subheading text-uppercase">Welcome to Openshift Hub</div>
                <a class="btn btn-primary btn-xl text-uppercase" href="#services">Know more</a>
            </div>
        </header>
        
        <!-- Services-->
        <section class="page-section" id="services">
            <div class="container">
                <div class="text-center">
                    <h2 class="section-heading text-uppercase">Services</h2>
                    <h3 class="section-subheading text-muted">Providing three ways to interact with the project</h3>
                </div>
                <div class="row text-center">
                    <div class="col-md-4">
                        <span class="fa-stack fa-4x">
                            <i class="fas fa-circle fa-stack-2x text-primary"></i>
                            <i class="fas fa-shopping-cart fa-stack-1x fa-inverse"></i>
                        </span>
                        <h4 class="my-3">Website</h4>
                        <p class="text-muted" style="text-align: justify">Brands can upload their products on the website, which will be visible to the end customers. A brand can also view the analytics of their customers and can send notifications to increse the engagement</p>
                    </div>
                    <div class="col-md-4">
                        <span class="fa-stack fa-4x">
                            <i class="fas fa-circle fa-stack-2x text-primary"></i>
                            <i class="fas fa-laptop fa-stack-1x fa-inverse"></i>
                        </span>
                        <h4 class="my-3">WhatsApp support</h4>
                        <p class="text-muted" style="text-align: center">Customers can use WhatsApp for a wide range of functionalities. They can list products of different companies, check the product from WhatsApp and, get the feedback submitted by them</p>
                    </div>
                    <div class="col-md-4">
                        <span class="fa-stack fa-4x">
                            <i class="fas fa-circle fa-stack-2x text-primary"></i>
                            <i class="fas fa-lock fa-stack-1x fa-inverse"></i>
                        </span>
                        <h4 class="my-3">Extension</h4>
                        <p class="text-muted" style="text-align: justify">Customers can use the extension to view products of a particular brand, personalized recommendations, submit feedback and earn badges. The extension acts as an engaging platform for customers.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- About-->
        <section class="page-section" id="about">
            <div class="container">
                <div class="text-center">
                    <h2 class="section-heading text-uppercase">About</h2>
                    <h3 class="section-subheading text-muted">What brands can do here?</h3>
                </div>
                <ul class="timeline">
                    <li>
                        <div class="timeline-image"><img class="rounded-circle img-fluid" src="assets/img/about/1.jpg" alt="..." /></div>
                        <div class="timeline-panel">
                            <div class="timeline-heading">
                                <h4>Signup</h4>
                                <h4 class="subheading">Create your account</h4>
                            </div>
                            <div class="timeline-body"><p class="text-muted">Join Openshift Hub by first signing in. Create your account as a brand, provide us with your name, category, and contact details.</p></div>
                        </div>
                    </li>
                    <li class="timeline-inverted">
                        <div class="timeline-image"><img class="rounded-circle img-fluid" src="assets/img/about/2.jpg" alt="..." /></div>
                        <div class="timeline-panel">
                            <div class="timeline-heading">
                                <h4>Products</h4>
                                <h4 class="subheading">List your products</h4>
                            </div>
                            <div class="timeline-body"><p class="text-muted">Then add your products & list it for the customers to know more. Add image, description & link for more reach</p></div>
                        </div>
                    </li>
                    <li>
                        <div class="timeline-image"><img class="rounded-circle img-fluid" src="assets/img/about/3.jpg" alt="..." /></div>
                        <div class="timeline-panel">
                            <div class="timeline-heading">
                                <h4>Analysis</h4>
                                <h4 class="subheading">Know your stats</h4>
                            </div>
                            <div class="timeline-body"><p class="text-muted">The analysis page shows the customer's engagement for your reference. Graphs are for age, gender, and number of products</p></div>
                        </div>
                    </li>
                    <li class="timeline-inverted">
                        <div class="timeline-image"><img class="rounded-circle img-fluid" src="assets/img/about/4.jpg" alt="..." /></div>
                        <div class="timeline-panel">
                            <div class="timeline-heading">
                                <h4>Seasonal updates</h4>
                                <h4 class="subheading">Interact with customers</h4>
                            </div>
                            <div class="timeline-body"><p class="text-muted">Send seasonal updates to your customers for a new product launch or any announcement. Selected customers will receive the update</p></div>
                        </div>
                    </li>
                    <li class="timeline-inverted">
                        <div class="timeline-image">
                            <h4>
                                Be a part
                                <br />
                                Of Our
                                <br />
                                journey!
                            </h4>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
        
        <!-- Clients-->
        <div class="py-5">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-3 col-sm-6 my-3">
                        <img class="img-fluid img-brand d-block mx-auto" src="assets/img/logos/nestle.svg" alt="..." aria-label="Nestle Logo" />
                    </div>
                    <div class="col-md-3 col-sm-6 my-3">
                        <img class="img-fluid img-brand d-block mx-auto" src="assets/img/logos/adidas.svg" alt="..." aria-label="Adidas  Logo" />
                    </div>
                    <div class="col-md-3 col-sm-6 my-3">
                        <img class="img-fluid img-brand d-block mx-auto" src="assets/img/logos/bosch.svg" alt="..." aria-label="Bosch Logo" />
                    </div>
                    <div class="col-md-3 col-sm-6 my-3">
                        <img class="img-fluid img-brand d-block mx-auto" src="assets/img/logos/IKEA.svg" style="width: 150px; height: 100px" alt="..." aria-label="IKEA Logo" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact-->
        <section class="page-section" id="login">
            <div class="container">
                <div class="text-center">
                    <h2 class="section-heading text-uppercase">Authenticate Me</h2>
                    <h3 class="section-subheading text-muted">Be a part of this great product</h3>
                </div>

                <div class="m-auto text-center m-0 mb-3">
                    <div class="btn-group btn-group-toggle w-50" style="margin-bottom: 20px; text-align: center; padding: 0;" data-toggle="buttons">
                        <label class="btn btn-secondary">
                            <input onclick="checkAuth(this)" type="radio" name="authOption" id="signup" autocomplete="off" checked> Signup
                        </label>
                        <label class="btn btn-secondary active">
                            <input onclick="checkAuth(this)" type="radio" name="authOption" id="login" autocomplete="off">Login
                        </label>
                    </div>
                </div>

                <!-- signup form -->
                <form class="authForm" id="signupForm">
                    <div class="row align-items-stretch">
                        <div class="col-md-6 m-auto">
                            <div class="form-group">
                                <!-- Name input-->
                                <input class="form-control" id="name" type="text" placeholder="Brand Name *" required/>
                            </div>
                            <div class="form-group">
                                <!-- Email address input-->
                                <input class="form-control" id="email" type="email" placeholder="Brand Email *" required/>
                            </div>
                        </div>
                        
                        <div class="col-md-6 m-auto mt-0">
                            <div class="form-group">
                                <!-- Address input-->
                                <input maxlength="50" class="form-control" id="address" type="text" placeholder="Brand Address (max 50 characters) *" required/>
                            </div>
                            
                            <div class="form-group">
                                <!-- Details address input-->
                                <input class="form-control" id="details" type="text" maxlength="100" placeholder="Brand Summary (max 100 characters) *" required/>
                            </div>
                        </div>
                        
                        <div class="col-md-12 m-auto mt-0">
                            <div class="form-control form-group" style="text-align: center;">
                                <div class="form-check" style="display: inline-block">
                                    <input class="form-check-input" type="radio" name="brandCategory" id="clothing">
                                    <label class="form-check-label" for="brandCategory">
                                      Clothing
                                    </label>
                                </div>
                                <div class="form-check" style="display: inline-block;">
                                    <input class="form-check-input" type="radio" name="brandCategory" id="electronics">
                                    <label class="form-check-label" for="brandCategory">
                                        Electronics
                                    </label>
                                </div>
                                <div class="form-check" style="display: inline-block;">
                                    <input class="form-check-input" type="radio" name="brandCategory" id="food">
                                    <label class="form-check-label" for="brandCategory">
                                        Food
                                    </label>
                                </div>
                                <div class="form-check" style="display: inline-block;">
                                    <input class="form-check-input" type="radio" name="brandCategory" id="furniture">
                                    <label class="form-check-label" for="brandCategory">
                                        Furniture
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 m-auto" id="extraDomainDiv" style="display: none">
                            <div class="form-control form-group text-center">
                                <div class="form-check m-auto w-100 p-0" style="display: inline-block; background: white">
                                    <input style="width: 100%; text-align: center" type="text" name="extraDomain" id="extraDomain" placeholder="For eg: https://wwww.nestle.in">
                                </div>
                            </div>
                        </div>
                        
                        <div class="invalid-feedback text-center m-2" id="signupError">Signup Error</div>
                    </div>
                    
                    <!-- Submit Button-->
                    <div class="text-center">
                        <img src="assets/loader.svg" style="display: none; margin:auto" id="loader" height="100px" alt="">
                        <input type="text" class="form-group text-center m-auto" style="display: none;" id="signupPwd" placeholder="Type in pwd & hit enter">
                        <input type="submit" class="btn btn-primary btn-xl text-uppercase m-auto" id="signupBtn" value="GET OTP"></input>
                    </div>
                </form>

                <!-- login form -->
                <form class="authForm" style="display: none;" id="loginForm">
                    <div class="row align-items-stretch">
                        <div class="col-md-6 m-auto">
                            <div class="form-group">
                                <!-- Email address input-->
                                <input class="form-control" id="email" type="email" placeholder="Brand Email *" />
                            </div>
                            <div class="form-group">
                                <!-- Name input-->
                                <input class="form-control" id="pwd" type="password" placeholder="Brand Password *" />
                            </div>
                            <div class="invalid-feedback text-center m-2" id="loginError">Login Error</div>
                        </div>
                    </div>
                    <!-- Submit Button-->
                    <div class="text-center">
                        <img src="assets/loader.svg" style="display: none; margin:auto" id="loader" height="100px" alt="">
                        <input type="submit" class="btn btn-primary btn-xl text-uppercase" id="loginBtn" value="Login"/>
                    </div>
                </form>

            </div>
        </section>

        <!-- Footer-->
        <footer class="footer py-4 bg-warning">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-4 text-lg-start">Copyright &copy; Openshift Hub</div>
                    <div class="col-lg-4 my-3 my-lg-0">
                        <a class="btn btn-dark btn-social mx-2" href="" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a class="btn btn-dark btn-social mx-2" href="" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a class="btn btn-dark btn-social mx-2" href="" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                    <div class="col-lg-4 text-lg-end">
                        <a class="link-dark text-decoration-none me-3">Simplicity is the key</a>
                    </div>
                </div>
            </div>
        </footer>
    </body>

    <script>
        let SERVER = "<?php echo getenv("server_url") ?>"
        SERVER = SERVER[SERVER.length - 1] === "/" ? SERVER.slice(0,SERVER.length - 1) : SERVER
        console.log("Setting up the server variable: " + SERVER)
    </script>
    <script src="./js/script.js"></script>
</html>
