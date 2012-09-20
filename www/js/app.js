$(document).ready(function() { 
	function init() {
		Tabletop.init( 
			{ key: '0Ala-N4Y4VPXIdEVnYVVNUEtqbF82M210ZmlJQWo2S2c',
			  callback: parseData,
			  simpleSheet: true
			} );
	}
	init();
	
	function parseData(data) {
		console.log(data);
		var content = '<dl>';
		$.each(data, function(x,y) {
			content += '<dt><strong>' + y.state + '</strong> <span>' + y.stateabbr + '</span></dt>';
			content += '<dd class="eipTrue"><strong>Early In-Person Voting:</strong> <span>' + y.earlyinperson + '</span></dd>';
			content += '<dd class="noExcuseTrue"><strong>"No Excuse" Absentee Ballots:</strong> <span>' + y.noexcuseabsentee + '</span></dd>';
			content += '<dd class="vbmTrue"><strong>Vote By Mail:</strong> <span>' + y.votebymail + '</span></dd>';

			content += '<dd class="absenteeDeadline"><strong>Absentee Ballot Request Deadline:</strong> <span>' + y.requestDeadline + '</span></dd>';
			content += '<dd class="absenteeMailed"><strong>Absentee Ballots Mailed:</strong> <span>' + y.absmailed + '</span></dd>';
			content += '<dd class="earlyInPerson"><strong>Early In-Person Voting Dates:</strong> <span>' + y.eipopen + '-' + y.eipclose + '</span></dd>';
			content += '<dd class="voterRegistration"><strong>Voter Registration Deadline:</strong> <span>' + y.registrationdeadline + '</span></dd>';
			content += '<dd class="voterRegistrationInfo"><strong>More:</strong> <span>' + y.registrationnote + '</span></dd>';
			content += '<dd class="generalElection"><strong>General Election:</strong> <span>' + y.generalelection + '</span></dd>';

			content += '<dd class="moreInfo"><span>Phone: ' + y.sosphone + ' | <a href="' + y.soswebsite + '">State Elections Website</a></span></dd>';
		});
		content += '</dl>';
		$('#earlyVoting').empty().append(content);
		
	}
	
} ); 
