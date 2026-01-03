const User = require("../models/user");
const dns = require('dns').promises;

// Helper: check whether an email's domain has MX records (basic existence check)
async function domainHasMx(domain) {
    try {
        const records = await dns.resolveMx(domain);
        return Array.isArray(records) && records.length > 0;
    } catch (e) {
        // resolveMx will throw for unknown domains — treat as no MX
        return false;
    }
}

module.exports.signupRender = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        // Basic email format check
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            req.flash('error', 'Please provide a valid email address.');
            return res.redirect('/signup');
        }

        const domain = email.split('@')[1].toLowerCase();
        const hasMx = await domainHasMx(domain);
        if (!hasMx) {
            req.flash('error', 'Email domain not found. Please use a real email address (no fake/random domains).');
            return res.redirect('/signup');
        }
        const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            let redirect = res.locals.redirectUrl || "/listings";
            res.redirect(redirect)
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");

    }
};

module.exports.logIn = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
};

module.exports.loginRender = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logout!");
        res.redirect("/listings");
    });
};

