import $ from 'jquery';
import { scrapeInfo, whenPageReady } from '../common/utils';

whenPageReady(() =>
  scrapeInfo('reviewHandler', () => ({
    reviewId: window.location.pathname.slice(5)
  }))
);
//   console.log('Looking for review');
//   const branchList = $('table.tracked-branches-table > tbody > tr');
//   const results = [];
//   branchList.each((i, el) => {
//     const repo = $(el).find(
//       '.tracked-branch-repository span.repository-name'
//     )[0].innerHTML;
//     const branch = $(el).find(
//       '.tracked-branch-target-branch span.branch-name'
//     )[0].innerHTML;
//     const non_empty = /\S{3,}/;
//     if (repo.match(non_empty) && branch.match(non_empty)) {
//       results.push({ repo, branch });
//     }
//   });
//   if (results.length > 0) {
//     return results;
//   } else {
//     console.log('Found Nothing');
//     return void 0;
//   }
// })
// );
