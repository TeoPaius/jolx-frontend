import {Component, Input, OnInit} from '@angular/core';
import {Posting} from '../../models/posting';
import {AuthService} from '../../services/auth.service';
import {PostingsService} from '../../services/postings.service';
import {MessageBus} from '../../services/message-bus';
import {UserHasUpdated} from '../../models/message-bus-events/user-has-updated';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input()
  posting: Posting;
  isUserPosting: Boolean;
  hasUserApplied: Boolean;

  constructor(private authService: AuthService,
              private postingService: PostingsService,
              private messageBus: MessageBus) {
  }

  ngOnInit(): void {
    this.checkPropertiesOnObserve();
    this.messageBus.observe(new UserHasUpdated(), () => {
      this.checkPropertiesOnObserve();
    });
  }

  checkPropertiesOnObserve() {
    this.checkIfUserPosting();

    if (!this.isUserPosting) {
      this.checkIfUserApplied();
    }
  }

  apply() {
    // TODO If unauthenticated user tried to apply, redirect him to login
    this.postingService.userAppliesForPosting(this.posting._id).subscribe(() => {
      console.log('APPLY', 'has clickd apply');
      return;
    });
  }

  unapply() {
    this.postingService.userUnAppliesForPosting(this.posting._id).subscribe((s) => {
      console.log(s);
    }, (e) => {
      console.log(e);
    });
  }

  /**
   * Returns whether the user has applied for the current posting.
   */
  checkIfUserApplied() {
    if (!this.authService.isAuthenticated) {
      this.hasUserApplied = false;
    }

    if (this.authService.user.postingsAppliedFor == null) {
      this.hasUserApplied = false;
    }

    this.hasUserApplied = this.authService.user.postingsAppliedFor.map((posting) => posting._id).indexOf(this.posting._id) > -1;
  }

  checkIfUserPosting() {
    if (!this.authService.isAuthenticated) {
      this.isUserPosting = false;
    }

    this.isUserPosting = this.authService.user.jobsPosted.map((posting) => posting._id).indexOf(this.posting._id) > -1;
  }
}
