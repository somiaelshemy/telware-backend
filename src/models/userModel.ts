import mongoose from 'mongoose';
import validator from 'validator';
import IUser from '@base/types/user';
import storySchema from '@base/models/storySchema';

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      minlength: [5, 'Username is at least 5 characters'],
      maxlength: [15, 'Username is at most 15 characters'],
      validate: {
        validator(username: string): boolean {
          const regex = /^[A-Za-z0-9_]+$/;
          return regex.test(username);
        },
        message: 'Username can contain only letters, numbers and underscore',
      },
    },
    screenName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      validate: [validator.isEmail, 'please provide a valid email'],
      required: [true, 'email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'A password is required'],
      maxLength: [15, 'max length is 15 characters'],
      minLength: [8, 'min length is 8 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'confirm your password'],
      select: false,
      validate: {
        validator(passwordConfirm: String): boolean {
          return passwordConfirm === this.password;
        },
        message: 'passwords are not the same',
      },
    },
    photo: String,
    status: {
      type: String,
      enum: ['online', 'connected', 'offline'],
      default: 'offline'
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      maxlength: [70, 'Bio is at most 70 characters'],
      default: '',
    },
    accountStatus: {
      type: String,
      enum: ['active', 'unverified', 'deactivated', 'banned'],
      default: 'unverified'
    },
    maxFileSize: {
      type: Number,
      default: 3145,
    },
    automaticDownloadEnable: {
      type: Boolean,
      default: true,
    },
    lastSeenPrivacy: {
      type: String,
      enum: ['everyone', 'contacts', 'nobody'],
      default: 'everyone',
    },
    readReceiptsEnablePrivacy: {
      type: Boolean,
      default: true,
    },
    storiesPrivacy: {
      type: String,
      enum: ['everyone', 'contacts', 'nobody'],
      default: 'everyone',
    },
    picturePrivacy: {
      type: String,
      enum: ['everyone', 'contacts', 'nobody'],
      default: 'everyone',
    },
    invitePermessionsPrivacy: {
      type: String,
      enum: ['everyone', 'admins'],
      default: 'everyone',
    },
    stories: [storySchema],
    blockedUsers: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    chats: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Chat',
        isMuted: {
          type: Boolean,
          default: false,
        },
        unmuteDuration: Number,
        Draft: {
          type: String,
          default: '',
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//TODO: Add index

const User = mongoose.model<IUser>('User', userSchema);
export default User;
