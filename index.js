import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const postsExamples = [
    {
        id: 1,
        title: "The Dentist Who Never Came Back",
        category: "Limbos",
        post: "The dentist said 'be right back.' That was 45 minutes ago. I'm still in the chair, bib on, mouth open, questioning every life choice.",
        date: "21.04.2026"
    },
    {
        id: 2,
        title: "I Accidentally Became a Raccoon",
        category: "Wrong Turns",
        post: "I meant to text 'I'll be there soon' but autocorrect changed it to 'I'll be a raccoon.' My boss now calls me 'Raccoon' in meetings. No regrets.",
        date: "21.04.2026"
    },
    {
        id: 3,
        title: "The Ghost Text",
        category: "Ghosts",
        post: "I still have a saved voicemail from a friend who isn't in my life anymore. I don't listen to it. I just like knowing it's there.",
        daye: "21.04.2026"
    },
    {
        id: 4,
        title: "Kiss This Guy",
        category: "Static",
        post: "For 20 years I thought 'Excuse me while I kiss the sky' was 'Excuse me while I kiss this guy.' I still sing it wrong on purpose. It's better this way.",
        date: "21.04.2026"
    },
    {
        id: 5,
        title: "The 3-Second Remote",
        category: "Scratches",
        post: "My remote takes 3 seconds to change channels. Not enough time to be angry. Just enough to feel something die inside every single time.",
        date: "21.04.2026"
    },
    {
        id: 6,
        title: "Deja Vu From a Dead Friend",
        category: "Glitches",
        post: "I thought about an old friend I hadn't seen in 10 years. Two seconds later, he texted me. Then I remembered he died in 2019. Still waiting for an explanation.",
        date: "21.04.2026"
    },
    {
        id: 7,
        title: "The Guitar That Never Was",
        category: "Leftovers",
        post: "I have a guitar I haven't touched in 4 years, a half-finished novel from 2017, and an unsent text that just says 'hey.' This is fine. Everything is fine.",
        date: "21.04.2026"
    },
    {
        id: 8,
        title: "I Understand Nothing",
        category: "Echoes",
        post: "My dad said 'you'll understand when you're older.' I'm 40 now. I still don't understand. But I say it to my kids anyway. The cycle continues.",
        date: "21.04.2026"
    },
    {
        id: 9,
        title: "Midnight Promises",
        category: "Thresholds",
        post: "Every birthday I tell myself this is the year I get organized. By March, I'm eating cereal for dinner in my car. Some thresholds don't stick.",
        date: "21.04.2026"
    },
    {
        id: 10,
        title: "The Yogurt Incident",
        category: "Vestigials",
        post: "My phone translated 'I love you' to 'I love yogurt' during a text to my wife. She said 'same.' I still don't know if she loves me or dairy.",
        date: "21.04.2026"
    },
    {
        id: 11,
        title: "Crying Emoji at Layoffs",
        category: "Humor",
        post: "I accidentally sent a crying emoji to my boss after he announced layoffs. He replied: 'Not funny.' I wasn't joking. But now I'm probably next on the list.",
        date: "21.04.2026"
    }
]

const app = express();
const port = 3000;
let posts = [...postsExamples];
let id = 11;

const postsObj = {
    "Humor": [postsExamples[10]],
    "Glitches": [postsExamples[5]],
    "Limbos": [postsExamples[0]],
    "Echoes": [postsExamples[7]],
    "Leftovers": [postsExamples[6]],
    "Wrong Turns": [postsExamples[1]],
    "Static": [postsExamples[3]],
    "Vestigials": [postsExamples[9]],
    "Thresholds": [postsExamples[8]],
    "Scratches": [postsExamples[4]],
    "Ghosts": [postsExamples[2]]
}

const categories = [
    "Humor", "Glitches",
    "Limbos", "Echoes", "Leftovers", "Wrong Turns",
    "Static", "Vestigials", "Thresholds", "Scratches",
    "Ghosts"
];


app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.currentUrl = req.path;
    next();
});


app.get("/", (req, res) => {
    res.render("index.ejs", { categories: categories, display: "", posts: posts });
});

app.get("/new_post", (req, res) => {

    res.render("newPost.ejs", { categories: categories, display: "d-none" });
});



app.post("/submit", (req, res) => {
    const post = req.body;
    const category = req.body.category;
    post.id = ++id;
    post.date = getDate();

    posts.unshift(req.body);
    postsObj[category].unshift(req.body);
    res.redirect("/");
});


categories.forEach(categ => {
    const path = `/${categ === "Wrong Turns" ? "Wrong_Turns" : categ}`;
    app.get(path, (req, res) => {
        res.render("index.ejs", { categories: categories, display: "", posts: postsObj[categ] });
    })
});

app.get("/about", (req, res) => {
    res.render("about.ejs", { categories: categories, display: "" });
});

app.get("/post/:category/:id", (req, res) => {
    const splitedPath = req.headers['referer'].split("/");
    const backPath = splitedPath[splitedPath.length - 1];
    const postId = parseInt(req.params.id);
    const post = postsObj[req.params.category].find(post => post.id === postId);
    res.render("post.ejs", { categories: categories, display: "none", post: post, backPath: backPath, inform: "" });
});

app.delete("/:category/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const category = req.params.category;
    if (id > 11) {
        removePost(id, category);
        res.redirect("/");
    } else {
        const post = postsObj[req.params.category].find(post => post.id === id);
        res.render("post.ejs", { categories: categories, display: "", post: post, backPath: "", inform: "deleted" });
    }

});

app.get("/edit_post/:category/:id", (req, res) => {
    let idInt = parseInt(req.params.id);
    if (idInt > 11) {
        const post = posts.find(post => post.id === idInt);
        removePost(parseInt(post.id), post.category);
        res.render("editPost.ejs", { categories: categories, display: "d-none", post: post });
    } else {
        const post = postsObj[req.params.category].find(post => post.id === idInt);
        res.render("post.ejs", { categories: categories, display: "", post: post, backPath: "", inform: "edit" });
    }


})

app.put("/:category/:id", (req, res) => {
    editPost(req.params.id, req.body);
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});




const categoriesObj = {
    humor: "Funny accident",
    glitches: "Weird coincidences, deja vu, software bugs in real life, timeline slips",
    limbos: "Waiting rooms, loading screens, airports at 3am, job interview limbo",
    echoes: "Generational patterns, songs stuck in head, recurring dreams, historical parallels",
    leftovers: "Half-read books, abandoned projects, expired coupons, unsent texts, dying hobbies",
    wrong_turns: "Mistakes that worked out, getting lost, typos that were better, failed plans",
    static: "Misheard lyrics, bad translations, glitchy photos, crossed phone lines, white noise",
    vestigials: "Misheard lyrics, bad translations, glitchy photos, crossed phone lines, white noise",
    thresholds: "Stepping over a doorway, crossing time zones, midnight, birthdays, start of seasons",
    scratches: "Sock seam under toe, typo in a tattoo, laggy remote, the one chipped mug",
    ghosts: "Canceled plans, deleted scenes, ex-friends, extinct animals, empty chairs"
}


function removePost(id, category) {
    const ind_posts = posts.findIndex(post => post.id === id);
    const ind_postsObj = postsObj[category].findIndex(post => post.id === id);
    if (ind_posts !== -1 && ind_postsObj !== -1) {
        posts.splice(ind_posts, 1);
        postsObj[category].splice(ind_postsObj, 1);
    }

};

function editPost(id, post) {
    let idInt = parseInt(id);

    if (id !== 1) {
        post["id"] = idInt;
        post["date"] = getDate();
        posts.unshift(post);
        postsObj[post.category].unshift(post);
    }
}

function findIndexOfPosts(array, id) {
    return array.findIndex(item => item.id === id);
}

function getDate() {
    const date = new Date();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }

    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    return `${day}.${month}.${date.getFullYear()}`;
}
