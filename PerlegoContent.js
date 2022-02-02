function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}

function fixStyle(isPDF) {
    if (!isPDF)
        document.body.style.padding = "40px";
    document.body.style["overflow-y"] = "scroll";

    // load images
    document.querySelectorAll("img").forEach((e)=>{
        const imageName = e.className.split("-");

        if (imageName.length === 2 && imageName[1] === "loader") {
            document.querySelector(`.${imageName[0]}`)?.remove();
            e.style["width"] = "100%";
            e.style["height"] = "100%";
            e.style["opacity"] = "100%";
            e.style["max-width"] = "100%";
            e.style["max-height"] = "100%";
        }
    }
    );

    // remove bootstrap
    const headerLinks = document.querySelectorAll("head > link");
    headerLinks.forEach((link)=>{
        if ((link)=>link.href.matches(/.*bootstrap.*/)) {
            link.remove();
        }
    }
    )
}

async function printPages(start, end) {
    document.querySelector("style").remove();
    const isPDF = document.querySelector(".pdf-content") != undefined;
    let printContents = "";

    for (let i = start; i <= end; i++) {
        let content;

        for (let j = i; j < i + 10; j++) {
            content = document.querySelector(`div[data-chapterid='${j}']`)
            if (content) {
                i = j;
                break;
            }
        }

        if (!content || content.querySelector(".pdfplaceholder") != null) {
            i--;
            await sleep(100);
            continue;
        }

        printContents += content.innerHTML;

        if (i !== end) {
            printContents += "<div style='page-break-before: always;'></div>"

            if (isPDF)
                content.scrollIntoView();
            else
                document.querySelector(`button[data-test-locator='ChevronButton-next-chapter']`).click();
        }
    }

    document.body.innerHTML = printContents;
    fixStyle(isPDF);

    console.log("Loading...");
    await sleep((end - start + 1) * 200);
    window.print();
}

"Enter printPages(startPage, endPage) to get started! ";
