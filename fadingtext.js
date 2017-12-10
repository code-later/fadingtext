/* eslint-env browser */
(function() {
  let wait = (ms) => {
    return new Promise(function(resolve, _reject) {
      setTimeout(resolve, ms);
    });
  };

  let random = (max) => {
    return Math.ceil(Math.random() * max);
  };

  class FadingText extends HTMLElement {
    connectedCallback () {
      this.paragrahps.forEach((paragraph) => {
        let words = paragraph.innerText.split(" ");

        paragraph.innerHTML = words.map((word) => {
          let span = document.createElement("span");
          span.innerText = word;

          return span.outerHTML;
        }).join(" ");
      });

      let animateP = (paragraph) => {
        let alreadyHidden = 0;
        let spansInP = paragraph.querySelectorAll("span");
        let threshold = spansInP.length * 0.2;

        let hideIt = (span) => {
          if (span && alreadyHidden < threshold) {
            alreadyHidden++;
            console.log(span);
            if (span.classList.contains("is-fading")) {
              hideIt(span.nextElementSibling);
            } else {
              span.addEventListener("transitionend", function() {
                let nextSpan = spansInP[(alreadyHidden * 3) + random(7)];
                hideIt(nextSpan);
              });
              span.classList.add("is-fading");
            }
          } else {
            wait((spansInP.length - alreadyHidden) * 150).then(() => {
              paragraph.addEventListener("transitionend", function() {
                if (paragraph.nextElementSibling) {
                  animateP(paragraph.nextElementSibling);
                } else {
                  console.log("last one");
                  animateP(document.querySelector("span.TheLastOne"));
                }
              });
              paragraph.classList.add("is-fading");
            });
          }
        };

        hideIt(spansInP[0]);
      };

      let animateHeadline = () => {
        let headline = this.querySelector("h1");
        let func = () => {
          animateP(this.querySelectorAll("p")[0]);
        };
        headline.addEventListener("transitionend", func.bind(this));
        headline.classList.add("is-fading");
      };

      wait(10000)
        .then(animateHeadline.bind(this));
    }

    get paragrahps () {
      return this.querySelectorAll("p");
    }
  }

  customElements.define("fading-text", FadingText);
})();
