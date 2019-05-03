import { Component } from '@angular/core';

import { Media, MediaObject } from '@ionic-native/media/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  playlist: any;

  isPlaying: boolean;
  playingIndex: number;
  repeatEnabled: boolean;

  duration: number;
  position: number;

  current: any;

  private musicFile: MediaObject[];
  private firstPlay: boolean;

  constructor(
    private media: Media
  ) {
    this.playlist = [
      {
        "url": "assets/music/001.mp3",
        "name": "Music 1"
      },
      {
        "url": "assets/music/002.mp3",
        "name": "Music 2"
      },
      {
        "url": "assets/music/003.mp3",
        "name": "Music 3 "
      },
    ];

    this.firstPlay = true;
    this.isPlaying = false;
    this.repeatEnabled = false;

    this.playingIndex = 0;

    this.current = {
      name: "Ninguno"
    };
  }

  ionViewWillEnter() {
    this.musicFile = [];
    for (let i = 0; i < this.playlist.length; i++) {
      this.musicFile[i] = this.media.create(this.playlist[i].url);
    }
  }

  playMusic(i: number) {
    if (this.isPlaying) {
      this.stopMusic();
    }

    this.musicFile[i].play();

    this.isPlaying = true;
    this.playingIndex = i;
    this.current = this.playlist[i];
    this.duration = this.musicFile[i].getDuration();
    this.position = 0;

    if (this.firstPlay) this.firstPlay = false;
  }

  stopMusic() {
    this.position = 0;
    this.musicFile[this.playingIndex].stop();
    this.isPlaying = false;
  }

  pauseMusic() {
    this.musicFile[this.playingIndex].pause();
    this.isPlaying = false;
  }

  resumeMusic() {
    if (this.firstPlay) {
      this.playMusic(0);
    } else {
      this.musicFile[this.playingIndex].play();
      this.isPlaying = true;
    }
  }

  nextMusic() {
    const nextIndex = typeof this.musicFile[this.playingIndex + 1] !== 'undefined' ? this.playingIndex + 1 : 0;
    this.playMusic(nextIndex);
  }

  prevMusic() {
    const prevIndex = typeof this.musicFile[this.playingIndex - 1] !== 'undefined' ? this.playingIndex - 1 : this.playlist.length - 1;
    this.playMusic(prevIndex);
  }

  loopMusic() {
    this.repeatEnabled = !this.repeatEnabled;
    this.musicFile[this.playingIndex].onStatusUpdate.subscribe((statusCode) => {
      if (statusCode == 4 && this.repeatEnabled) {
        this.playMusic(this.playingIndex);
      }
    });
  }

  controlProgressBar(event) {
    var self = this;
    if (this.isPlaying == true) {
      setInterval(function () {
        self.musicFile[self.playingIndex].getCurrentPosition().then((position) => {
          self.position = position;
        });
      }, 1000);
    }
  }
}
