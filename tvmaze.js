const missingImgUrl = "https://tinyurl.com/tv-missing";

async function searchShows(query) {
  let res = await axios.get("http://api.tvmaze.com/search/shows", {
    params: {
      q: `${query}`,
    },
  });

  let shows = res.data.map((result) => {
    let show = result.show;

    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.original : missingImgUrl,
    };
  });

  return shows;
}

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
           <img class"card-img-top" src=${show.image} style="width: 11.5rem">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-warning episode">Episodes</button>
           </div>
         </div>
       </div>
       
      `
    );

    $showsList.append($item);
  }
}

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

async function getEpisodes(id) {
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = res.data.map((episode) => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
    let $item = $(
      `<li>
      ${episode.name}(season: ${episode.season}, number: ${episode.number})
      </li>
      `
    );

    $episodesList.append($item);
  }

  $("#episodes-area").show();
}

$("#shows-list").on("click", ".episode", async function handleEpisode(evt) {
  evt.preventDefault();

  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);

  populateEpisodes(episodes);
});
