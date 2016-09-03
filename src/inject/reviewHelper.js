const getInfo = () => {
  const reviewFinder = () => {
    let branchList = $("table.tracked-branches-table > tbody > tr")
    let results = []
    branchList.each((i, el) => {
      let repo = $(el).find(".tracked-branch-repository span.repository-name")[0].innerHTML
      let branch = $(el).find(".tracked-branch-target-branch span.branch-name")[0].innerHTML
      non_empty = /\S{3,}/
      if (repo.match(non_empty) && branch.match(non_empty)) {
        results.push([repo, branch])
      }
    })
    return (results.length > 0) ? results : void 0
  }

  scrapeInfo("reviewInfo", reviewFinder)

}

whenPageReady(getInfo, /^[http://crucible.cbinsights.com/cru]\S+$/)
