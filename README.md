# [Faceclash](https://faceclash.ml)
Source code of the game I made in mid-October to November 2016, and stirred people up at my school a little. It initially started out as a
learning experiment with SQL, AJAX, and the Elo rating algorithm. This game was inspired by Mark Zuckerberg's Facemash from back in 2003.

### A brief look at Facemash
Facemash was Facebook's predecessor. It put two photos of female students at Harvard next to each other, and let people choose who was hot, and
who was not. It was considered Harvard's version of the Hot-or-Not game by many, it was a success within four hours of its launch. The entire
website was put together in one night, a span of eight hours near midnight to be specific. How did he get all the photos, you ask? Well, it was
certainly not voluntarily given to him. He programmatically scraped the online facebooks of the nine houses at Harvard. By morning, the site had
accumulated a total of 450 unique visitors and 22,000 impressions. He was eventually forced to take the site down, due to several crimes, which included
violation of copyright, privacy, and breaching of security. He would also face expulsion from Harvard. All these charges against him were eventually
dropped. He didn't let the fear of getting in trouble stop him, and eventually, in an attempt to restore his reputation, he created
[Facebook](https://facebook.com), which is now valued at over $350 billion.

### Looking at Faceclash
Faceclash is 13 years away from its predecessor. But it still keeps most if not all of the functionalities of the original game. You still
have two pictures of people next to each other, you still click on one to choose them as the hotter one, and perhaps most renowned, the
famous line: "Were we let in for our looks? No. Will we be judged by them? Yes.". The site went live on Sunday, November 13, 2016 at approximately
4pm. By Monday morning, it had already gained 730 unique visitors and 18,000 impressions. I was called to the principal's office around the
afternoon, to discuss about the potential dangers of the site. My principal told me that I wasn't actually breaking any rules, in keeping the
site up, but recommended me take it down, before anything happened that would hold me responsible. I decided to take his advice
and take it down. This was after he received numerous complaints from both students and teachers of photos being submitted to the site
without the owners' consent. I shut the site down right in front of him, right then and there. No site I've made, ever, has received this much
traffic in one night. Although this may've pissed some people off, I believe there were more good things than bad things attributed with the
creation of Faceclash. Faceclash has had a good run, some called it a failure, but many defined it as a success. I knew I'd have to call
quits on the site at some point, and I didn't think it'd take place so soon. But I had already gotten what I needed from it. Many considered
it my school's version of Tinder. Everything was pretty awesome those days. :smile:

### Features
- Administration dashboard, control over images
- Reporting content
- End-user photo submission
- Fully JavaScript frontend, with PHP backend
- User-configurable settings, preferred gender
- Modernized user interface, fully responsive

### Requirements
- PHP
- Imagick (PHP extension)
- MySQL
- A decent amount of storage for the data and photos
- Suitable hardware for the traffic

### Configuration variables
The web app will need some credentials in order to function properly. Modify them in the `config.php` file.
- `DATABASE_USER`: Database user
- `DATABASE_PASS`: Database password
- `DATABASE_HOST`: Database host
- `DATABASE_NAME`: Database name
- `ADMIN_USER`: Administration dashboard login username, default username is `admin`
- `ADMIN_PASS`: Administration dashboard login password, default password is `password`
- `APP_DEBUG`: If set to `true`, errors will be reported

### Setup
1. Make sure all requirements are fulfilled.
2. `cd` into the directory you want Faceclash to be in.
3. Clone this repository using the command `git clone https://github.com/ifvictr/faceclash.git .`.
4. Set up the database, and properly configure all fields in `config.php`.
5. Find some good pictures of people, male or female, by hacking into some facebooks of the educational institution you currently attend. Then start uploading them to the site.
6. Email a few of your friends asking them to help you test to see if it's up and running.
7. Keep the site up overnight, and you'll probably have at least 22,000 votes by morning. :wink:
8. Get in trouble with the institution you currently attend, and get close to being expelled from it.
9. Drop out of the place, and found a company with an idea you got from the game.
10. Make billions of dollars off of that company.

### License
[MIT](LICENSE.txt)