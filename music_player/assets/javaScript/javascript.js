const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'AT_PLAYER'

const player = $(".player");
const cd = $(".cd");
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-radom')
const repeatBtn = $('.btn-repeat')
const progress = $('#progress')
const playlist = $ ('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    songs: [{
        name: "Ai muốn nghe không",
        singer: "Đen Vâu",
        path: "assets/music/y2mate.com - Đen  Ai muốn nghe không MV.mp3",
        image: "https://kenh14cdn.com/203336854389633024/2022/5/11/photo-1-1652234154418247276923.jpg"
    },

    {
        name: "Past lives 31073",
        singer: "Nam Em Cover",
        path: "assets/music/y2mate.com - Past lives 31073  Nam Em cover  Hơi Thở Âm Nhạc  St Borns  Wn.mp3",
        image: "https://i.ytimg.com/vi/JCy7CpKFX4c/hqdefault.jpg"
    },

    {
        name: "Lối Nhỏ",
        singer: "Đen Vâu ft Phương Anh Đào",
        path: "assets/music/y2mate.com - Đen  Lối Nhỏ ft Phương Anh Đào MV.mp3",
        image: "https://i1.sndcdn.com/artworks-000626912503-seu7o8-t500x500.jpg"
    },

    {
        name: "Bài Hát Cho Nỗi Cô Đơn",
        singer: "Nam Em Cover",
        path: "assets/music/y2mate.com - Bài Hát Cho Nỗi Cô Đơn  Nam Em Cover  Live at Lululola Coffee  Lời Việt  Đặng Thanh Tuyền.mp3",
        image: "https://i.ytimg.com/vi/R7O0RcOuylw/mqdefault.jpg"
    },

    {
        name: "Trốn Tìm",
        singer: "Đen Vâu",
        path: "assets/music/y2mate.com - Đen  Trốn Tìm ft MTV band MV.mp3",
        image: "https://image.thanhnien.vn/w980/Uploaded/2022/ifyiy/2021_05_17/2j3a0095_erao.jpg"
    },
    {
        name: "Angel Bayby",
        singer: "Troye Sivan",
        path: "assets/music/y2mate.com -  Vietsub  Lyrics  Angel Bayby  Troye Sivan.mp3",
        image: "https://thegioidienanh.vn/stores/news_dataimages/thanhtan/092021/11/10/in_article/3421_pasted_image_0_5.jpg?rt=20210911103454"
    },
    {
        name: "Hai Đám Mây ",
        singer: "Khói",
        path: "assets/music/y2mate.com - Khói  Hai Đám Mây Official MV.mp3",
        image: "https://i.scdn.co/image/ab67616d0000b2738218212ed69af74d4cf46829"
    },
    {
        name: "At My WorstLyricsVietsub",
        singer: "Pink Sweat",
        path: "assets/music/y2mate.com - Pink Sweat  At My WorstLyricsVietsub  RADIO 369.mp3",
        image: "https://i.ytimg.com/vi/QkgeASlDIN0/hqdefault.jpg"
    },
    {
        name: "Reality",
        singer: "Lost  Frequencies",
        path: "assets/music/y2mate.com - Reality    Lost  Frequencies     Lyrics  Vietsub.mp3",
        image: "https://i.ytimg.com/vi/GIDoQsQyS0s/maxresdefault.jpg"
    }],

    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}');"></div>


                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
        
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>    
            `
        });
        playlist.innerHTML = htmls.join('')
    },
    defineProperti: function (){
        
        Object.defineProperty(this, "currentSong",{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function(){
        const _this = this
        const Cdwidth = cd.offsetWidth

        // xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration:10000, // 10 seconds
            Interations: Infinity 
        })

        cdThumbAnimate.pause()

        // xử lý phóng to/ thu nhỏ
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdwidth = Cdwidth - scrollTop


            // console.log (newCdwidth)
            cd.style.width = newCdwidth > 0 ? newCdwidth + 'px' : 0
            cd.style.opacity = newCdwidth / Cdwidth

        }

        // xử lý khi click vào play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
                
            }else{
                audio.play()
                
            }
            
        }
        // khi song được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

         // khi song bị pause
         audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value = progressPercent
            }
        }

        // sử lý khi tua song
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime 
        }

        // khi next bài hát
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                    _this.prevSong()
                }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
       

        // khi random song xử lý bật/ tắt
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom)
            
        }

        // xử lý lập lại một song
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }


        //  Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if( songNode || e.target.closest('.option')){
                // xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
               
            }
        }

    },

    scrollToActiveSong : function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        },300)
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        
        // console.log(heading, cdThumb, audio)
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function (){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function (){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;

        this.loadCurrentSong()
    },

    start: function(){
        // load cấu hình
        this.loadConfig()

        // Định nghĩa các thuộc tính trong Object
        this.defineProperti()

        // lắng nghe và sử lý các sự kiện trong DOM Events
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // render playlist
        this.render()

        // hiển thị trang thái ban đầu của buttun random và repeat 
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)
    }
}
app.start()
