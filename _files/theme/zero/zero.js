$(document).ready(function () {

  // click "Run" to replay
  var $hero = $('.hero');

  //$hero.find('h1').lettering();

  var onLoad = [
      {
        elements: $hero,
        properties: {
          width: '100%'
      },
       options: {
        duration: 500,
        complete: function () {
          $hero.find('h1').children().each(function(i){
            $(this).velocity({
              top: 0,
              opacity: 1
            },{
              duration: 400,
              delay: (i - 1) * 30
            });
          });

          $hero.find('.sub-text').velocity({
            top: 0,
            opacity: 1,
            height: '5rem'
          },{
            duration: 350
          });
        }
      }
    }
  ];

  $.Velocity.RunSequence(onLoad);
})
