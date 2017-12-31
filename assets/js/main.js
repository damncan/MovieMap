var markers = [];

var datetime;
var selectedMovie;
var cinemaShowtime;

toastr.options.timeOut = 2000;



// cinema click
function onClick(e) {
  $("#collapseShowtime").find("a.list-group-item").remove();
  $("#collapseDiscount").find(".list-group").remove();

  // var datetime = "12/27/2017 1:15 AM";
  // var selectedMovie = ["1", "2", "3", "4", "5"];
  // var selectedCinema = 1;

  var selectedCinema = this.options.id;

  // refresh options
  $.get("http://localhost:1337/showtime/getShowtimesByCinema?datetime=" + datetime + "&selectedMovie=" + selectedMovie + "&selectedCinema=" + selectedCinema, function (data) {
    if (typeof (data.showtime) == "undefined") {
      toastr.error('查無資料，請重新查詢！');
    } else {
      toastr.success('看看右邊！');

      // refresh showtime info
      cinemaShowtime = data.showtime;

      var options = [];
      for (var k in data.showtime) {
        if (data.showtime.hasOwnProperty(k)) {
          var option = "<option>" + k + "</option>"
          options.push(option);
        }
      }
      $('#selectorMovieInShowtime').html(options);
      $('#selectorMovieInShowtime').selectpicker('refresh');

      // refresh credit card info
      cinemaMarketings = data.marketing;

      cinemaMarketings.forEach(function (cinemaMarketing, i) {
        var active = '';
        if(i % 2 == 1){
          active = ' active';
        }
        var appendHtml = '\
          <div class="list-group">\
            <a href='+ cinemaMarketing.url +' class="list-group-item'+ active +'">\
              <h4 class="list-group-item-heading">'+ cinemaMarketing.title +'</h4>\
              <p class="list-group-item-text">'+ cinemaMarketing.content +'</p>\
            </a>\
          </div>\
        ';
        $("#collapseDiscount").append(appendHtml);
      });
    }
  });
}



$(document).ready(function () {
  // init date picker
  $('#datetimepicker1').datetimepicker();

  // init map
  var map = L.map('map').setView([25.052040, 121.533026], 13);
  var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmLayer = new L.TileLayer(osmUrl, {
    maxZoom: 19,
    attribution: 'Map data © OpenStreetMap contributors'
  });
  map.addLayer(osmLayer);

  // search button click listener
  $("#search").click(function () {
    var options = [];
    $('#selectorMovieInShowtime').html(options);
    $('#selectorMovieInShowtime').selectpicker('refresh');
    $("#collapseShowtime").find("a.list-group-item").remove();
    $("#collapseDiscount").find(".list-group").remove();

    datetime = $("#datetimepicker1").find("input").val();
    selectedMovie = $("#selectorMovie").val();
    var selectedCinema = $("#selectorCinema").val();

    $.get("http://localhost:1337/showtime/getCinemasBySearch?datetime=" + datetime + "&selectedMovie=" + selectedMovie + "&selectedCinema=" + selectedCinema, function (data) {
      if (data.length > 0) {
        toastr.success('接著，在地圖上選擇想去影城～');
        markers.forEach(function (m) {
          map.removeLayer(m)
        });

        data.forEach(function (cinema) {
          var marker = L.marker([cinema.lat, cinema.long], { title: cinema.cinemaName, id: cinema.id }).addTo(map).bindPopup(cinema.cinemaName).on('click', onClick);
          markers.push(marker);
        });
      } else {
        toastr.error('查無資料，請重新查詢！');
      }
    });
  });

  // refresh showtime
  $('#selectorMovieInShowtime').on('change', function () {
    $("#collapseShowtime").find("a.list-group-item").remove();
    var selected = $(this).find("option:selected").val();
    movieShowtime = cinemaShowtime[selected];

    for (var k in movieShowtime) {
      if (movieShowtime.hasOwnProperty(k)) {
        var time = moment.utc(movieShowtime[k].showtime).format('HH:mm');
        $("#collapseShowtime").append('<a href="' + movieShowtime[k].cinemaModel.url + '" class="list-group-item">' + time + '<span class="badge">' + movieShowtime[k].available + '</span></a>');
      }
    }
  });

  $('#collapseShowtime').on('click', function () {
    if ($('#selectorMovieInShowtime').find("option").length < 1) {
      toastr.warning('請先在地圖上選擇影城！');
    }
  });
});