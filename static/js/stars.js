var background = document.getElementById("space"),
	bgCtx = background.getContext("2d"),
	width = window.innerWidth,
	height = window.innerHeight;

	background.width = width;
	background.height = height;

    $(window).on("resize", function(){
        height = document.body.offsetHeight;
        width = window.innerWidth;
        background.width = width;
        background.height = height;
        entities = [];
		addStars();
    });

	// Second canvas used for the stars
	bgCtx.fillStyle = '#05004c';
	bgCtx.fillRect(0,0,width,height);

	// stars
	function Star(options){
		this.size = Math.random()*2;
		this.speed = Math.random()*.1;
		this.x = options.x;
		this.y = options.y;
	}

	Star.prototype.reset = function(c){
		this.size = Math.random()*2;
        this.speed = Math.random()*.1;
        if(c == "+x"){
            this.x = width;
            this.y = Math.random()*height;
        }
        if(c == "-x"){
            this.x = 0;
		    this.y = Math.random()*height;
        }
        if(c == "+y"){
            this.y = height;
            this.x = Math.random()*width;
        }
        if(c == "-y"){
            this.y = 0;
		    this.x = Math.random()*width;
        }
	}
	
	Star.prototype.update = function(offsetX, offsetY){
        this.x-=this.speed;
        this.x+=offsetX;
        this.y+=offsetY;
		if((this.x<0)||( this.x > width)){
            if(this.x < 0){
                this.reset("+x");
            } else {
                this.reset("-x");
            }
		} else
        if((this.y < 0) || (this.y > height)){
            if(this.y < 0){
                this.reset("+y");
            } else {
                this.reset("-y");
            }
        }
        else {
		  bgCtx.fillRect(this.x,this.y,this.size,this.size); 
		}
    }

	var entities = [];
	
	// init the stars
	function addStars(){
		for(var i=0; i < height; i++){
			entities.push(new Star({x:Math.random()*width, y:Math.random()*height}));
		}
	}
  

	addStars();
	
	//animate background
	function animate(){
		bgCtx.fillStyle = '#02000C';
		bgCtx.fillRect(0,0,width,height);
		bgCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
		bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';

		var entLen = entities.length;
        
		while(entLen--){
			entities[entLen].update(0,0);
        }

		
		requestAnimationFrame(animate);
	}
	animate();