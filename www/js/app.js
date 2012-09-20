$(document).ready(function() {
	var days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
	var months = [ "Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec." ];
	
	var startDate = new Date('09/01/2012');
	var endDate = new Date('11/06/2012');
	var timeSpan = endDate.getTime() - startDate.getTime();
	var numDays = Math.round((((timeSpan / 1000) / 60) / 60) / 24);
	var dayWidthPct = 100/numDays + '%';

	function init() {
		Tabletop.init( 
			{ key: '0Ala-N4Y4VPXIdEVnYVVNUEtqbF82M210ZmlJQWo2S2c',
			  callback: parseData,
			  simpleSheet: true
			} );
	}
	init();
	
	function parseData(data) {
		console.log(data[0]);
		var content = '';
		$.each(data, function(x,y) {
			content += '<div class="row">';
			content += '<div class="span3">';
			content += '<dt><strong>' + y.state + '</strong> <span>' + y.stateabbr + '</span></dt>';
			content += '<dd class="moreInfo">' +
						'<strong>State Elections Board:</strong><br />' +
						'<span>Phone: ' + y.sosphone + '<br />' + 
						'<a href="' + y.soswebsite + '">State Elections Website</a></span></dd>';

			content += '<dd class="eipTrue"><strong>Early In-Person Voting:</strong> <span>' + y.earlyinperson + '</span></dd>';
			content += '<dd class="noExcuseTrue"><strong>"No Excuse" Absentee Ballots:</strong> <span>' + y.noexcuseabsentee + '</span></dd>';
			content += '<dd class="vbmTrue"><strong>Vote By Mail:</strong> <span>' + y.votebymail + '</span></dd>';

			content += '<dd class="absenteeDeadline"><strong>Absentee Ballot Request Deadline:</strong> <span>' + formatDate(y.requestdeadline) + '</span></dd>';
			content += '<dd class="absenteeMailed"><strong>Absentee Ballots Mailed:</strong> <span>' + formatDate(y.absmailed) + '</span></dd>';
			content += '<dd class="earlyInPerson"><strong>Early In-Person Voting Dates:</strong> <span>' + formatDate(y.eipopen) + ' through ' + formatDate(y.eipclose) + '</span></dd>';
			content += '<dd class="voterRegistration"><strong>Last Day To Register To Vote:</strong> <span>' + formatDate(y.registrationdeadline) + '</span></dd>';
			content += '<dd class="voterRegistrationInfo"><strong>More:</strong> <span>' + y.registrationnote + '</span></dd>';
			content += '<dd class="generalElection"><strong>General Election:</strong> <span>' + formatDate(y.generalelection) + '</span></dd>';
			content += '</div>';
			
			content += '<div class="span9 calendar">';
			
			if (y.registrationdeadline) {
				content += '<div class="marker deadline voterRegistration" style="width: ' + dayWidthPct + '; left: ' + positionMarker(y.registrationdeadline) + '%;">' + formatDate(y.registrationdeadline) + '</div>';
			}
			if (y.requestdeadline) {
				content += '<div class="marker deadline absenteeDeadline" style="width: ' + dayWidthPct + '; left: ' + positionMarker(y.requestdeadline) + '%;">' + formatDate(y.requestdeadline) + '</div>';
			}
			if (y.generalelection) {
				content += '<div class="marker deadline generalElection" style="width: ' + dayWidthPct + '; left: ' + positionMarker(y.generalelection) + '%;">' + formatDate(y.generalelection) + '</div>';
			}

			if (y.absmailed) {
				content += '<div class="marker absentee" style="width: ' + sizeMarker(y.absmailed, y.generalelection) + '; left: ' + positionMarker(y.absmailed) + '%;">' + formatDate(y.absmailed) + '</div>';
			}

			if (y.eipopen) {
				content += '<div class="marker earlyInPerson" style="width: ' + sizeMarker(y.eipopen, y.eipclose) + '; left: ' + positionMarker(y.eipopen) + '%;">' + formatDate(y.eipopen) + ' through ' + formatDate(y.eipclose) + '</div>';
			}

			// plot absentee voting window
			content += '</div>';
			
			content += '</div>';
			
			formatDate(y.registrationdeadline);
		});
		content += '</div>';
		$('#earlyVoting').empty().append(content);
		
	}
	
	function formatDate(d) {
		var dObj = new Date(d);
		var dFmt = days[dObj.getDay()] + ', ' + months[dObj.getMonth()] + ' ' + dObj.getDate();
		return dFmt;
	}
	
	function positionMarker(d) {
		var dObj = new Date(d);
		var dOffset = ((dObj.getTime() - startDate.getTime()) / timeSpan) * 100;
		return dOffset;
	}
	
	function sizeMarker(d,e) {
		var dObj = new Date(d);
		var eObj = new Date(e);
		// 86400000 == one day in milliseconds
		var dStartOffset = ((dObj.getTime() - startDate.getTime()) / timeSpan) * 100;
		var dSpan = ((eObj.getTime() - dObj.getTime() + 86400000) / timeSpan) * 100;
		return dSpan + '%';
	}
	
} ); 
