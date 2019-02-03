/* globals ReactiveVar, TAPi18n */
import { Template } from 'meteor/templating';
import _ from 'underscore';

Template.RocketReplies.events = {};

Template.RocketReplies.helpers({
	getroomData(){
		const roomData = Session.get(`roomData${Template.instance().data.tabBar.data.curValue.message.rid}`);
		return roomData;
	},
	parentMessage(){

		const query =
			{ '_id': Template.instance().data.tabBar.data.curValue.message._id };

		const options = {
			sort: {
				ts: 1,
			},
		};

		return ChatMessage.find(query, options);
	},
	replies() {
		const query =
			{ 'customFields.ref': Template.instance().data.tabBar.data.curValue.message._id };

		const options = {
			sort: {
				ts: 1,
			},
		};

		return ChatMessage.find(query, options);
	}
});

Template.RocketReplies.onCreated(function () {

	let rid = Template.instance().data.tabBar.data.curValue.message.rid;
	let parentMessage = Template.instance().data.tabBar.data.curValue.message._id;

	Meteor.call('loadReplyHistory', rid, parentMessage, (err, result) => {
		if (err) {
			return;
		}
		const { messages = [] } = result;
		messages.forEach(msg => {
			ChatMessage.upsert({ _id: msg._id }, msg);
		});		
	});
	
});

Template.RocketReplies.onRendered(function() {
	const { input } = chatMessages[this.data.tabBar.data.curValue.message.rid];
	$(input)
		.focus()
		.data('mention-user', true)
		.data('reply', Template.instance().data.tabBar.data.curValue.message)
		.trigger('dataChange');
		
});

Template.RocketReplies.onDestroyed(function() {});

