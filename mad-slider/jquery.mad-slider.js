(function($){
  madSlider = {

    init: function ( options ) {

      var settings = $.extend({
        show: 2,
        step: 1,
        indent: 3,  // расстояние между сладйами, px
        speed: 100, // скорость прокрутки слайдов
        next: '>',
        prev: '<',
        navInterval: 50, // ширина занимаемой области кнопок, px
        autoPlay: false,
        delay: 2000, // время задержки при прокрутке
        nav: true,
        minmap: true,
      }, options || {});
      
      return this.each(function(){
        if ( settings.show === 1 ) settings.step = 1;

        var $slider = {},
            $ths = $(this),
            parentwidth = $ths.width(),
            containerwidth = parentwidth-settings.navInterval*2,
            slidewidth = containerwidth/settings.show;

        var css = {
          ths: {
            'visibility': 'visible',
            'transition': 'all .8s',
            'opacity': '1',
          },
          slides: {
            'width': (slidewidth-settings.indent*2)+'px',
            'marginLeft': settings.indent+'px',
            'marginRight': settings.indent+'px',
          },
          line: {
            'transitionDelay': settings.speed/1000+'s',
            'width': '5000px',
            'left': '0',
          },
        }
        
        $ths.addClass('mad-slider');
        var $slides = $ths.find('div').addClass('ms-slide').css( css.slides );
        var $container = $('<div class="ms__container"></div>').appendTo( $ths );
        $container.css({'height': $slides.height()+'px','width': containerwidth + 'px'});
        var $line = $('<div class="ms__line"></div>').css( css.line ).appendTo( $container );
        $slides.appendTo( $line );

        if ( settings.nav ) {
          var $nav = $('<div class="ms-nav"></div>').appendTo( $ths );
          var $next = $('<span class="ms-nav__btn ms-nav__next">'+ settings.next +'</span>').appendTo( $nav )
                      .bind('click', function(){ madSlider.next.call( $ths ); });
          var $prev = $('<span class="ms-nav__btn ms-nav__prev">'+ settings.prev +'</span>').appendTo( $nav )
                      .bind('click', function(){ madSlider.prev.call( $ths ); });
          
          $slider.nav = $nav;
          $slider.next = $next;
          $slider.prev = $prev;
        }
        
        if ( settings.minmap ) {
          $container.css({'marginBottom':'30px'});
          
          var $minmap = $('<div class="ms__minmap"></div>').appendTo( $ths );
          var $minmapcontainer = $('<ul class="ms_minmapcontainer"></ul>').appendTo( $minmap );

          var $minmapitems = '';
          var minmaplength = $slides.length;
          if ( settings.show > 1 ) {
            minmaplength = $slides.length-(settings.show-1);
          }
          for (var i=0; i<minmaplength; i++ ) {
            $minmapitems += '<li class="ms_minmapitem"></li>';
          }
          $minmapitems = $( $minmapitems ).eq(0).addClass('ms_minmapitem_active').end().each(function(i){
            $(this).bind('click', function(){ madSlider.showSlide.call( $ths, i ) });
          });
          $minmapitems.appendTo( $minmapcontainer );

          $slider.minmapitems = $minmapitems;
        }

        $slider.slides = $slides;
        $slider.container = $container;
        $slider.line = $line;
        $ths.data('$slider', $slider);
        
        settings.currentposition = 0;
        settings.step = settings.step * slidewidth;
        settings.endposition = ($slides.length - settings.show) * slidewidth;
        settings.slidewidth = slidewidth;
        $ths.data('settings', settings);

        $ths.css( css.ths );
        
        if ( settings.autoPlay ) {
          setInterval(function(){ $ths.madSlider('next') }, settings.delay);
        }       

      });
    },

    next: function () {
      return this.each(function(){

        var $ths = $(this),
            $slider = $ths.data('$slider'),
            settings = $ths.data('settings');
        
        if ( settings.currentposition > -settings.endposition ) {
          if (  Math.abs(settings.endposition) - Math.abs(settings.currentposition) < settings.step ) {
            settings.currentposition = -settings.endposition;
          } else {
            settings.currentposition -= settings.step;
          }
        } else {
          settings.currentposition = 0;
        }
        
        if ( settings.minmap ) {
          var minmapitem = Math.abs( settings.currentposition/settings.slidewidth );
          $slider.minmapitems.removeClass('ms_minmapitem_active')
            .eq(minmapitem).addClass('ms_minmapitem_active');
        }      

        $slider.line.css({ 'left': settings.currentposition+'px' });
        $ths.data('settings', settings);
        
      });
    },

    prev: function () {
      return this.each(function(){
        
        var $ths = $(this),
            $slider = $ths.data('$slider'),
            settings = $ths.data('settings');
        
        if ( settings.currentposition < 0 ) {
          if ( Math.abs(settings.currentposition) < settings.step ) {
            settings.currentposition = 0;
          } else {
            settings.currentposition += settings.step;
          }
          $slider.line.css({ 'left': settings.currentposition+'px' });
        }

        if ( settings.minmap ) {
          var minmapitem = Math.abs( settings.currentposition/settings.slidewidth );
          $slider.minmapitems.removeClass('ms_minmapitem_active')
            .eq(minmapitem).addClass('ms_minmapitem_active');
        }

        $ths.data('settings', settings);

      });
    },

    showSlide: function( minmapitem ) {
      return this.each(function(){

        var $ths = $(this),
        $slider = $ths.data('$slider'),
        settings = $ths.data('settings');
        
        $slider.minmapitems.removeClass('ms_minmapitem_active').eq(minmapitem).addClass('ms_minmapitem_active');

        settings.currentposition = -minmapitem*settings.slidewidth;
        $slider.line.css({ 'left': settings.currentposition+'px' });
        
        $ths.data('settings', settings); 

      });      
    },

  }
  
  $.fn.madSlider = function( method ) {
    var arg = Array.prototype.slice.call( arguments, 1 );

    if ( arguments.length == 0 ) {
      return madSlider["init"].apply( this, arg );
    } else {
      if ( !(method in madSlider) ) {
        console.log( "Не найден метод '"+ method +"' в плагине jQuery.madSlider" );
      } else {        
        return madSlider[method].apply( this, arg );
      }
    }
  }

})( jQuery );