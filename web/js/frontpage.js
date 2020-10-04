$(".popupContainer").fadeOut(0);
        $(".systemInfo").click(function(){
            $(this).siblings().fadeIn(150);
        });
        $(".closePopup").click(function(){
            $(".popupContainer").fadeOut(150);
        });