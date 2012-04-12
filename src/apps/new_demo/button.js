$class('tau.new_demo.Button').extend(tau.ui.SceneController).define({
	Button : function() {
		this.setTitle('Button');
	},

	loadScene : function() {
		var scene = this.getScene();

		var vPanel = new tau.ui.ScrollPanel({
			styles : {
				'display' : 'flexbox',
				'-webkit-box-orient' : 'vertical',
				'-webkit-box-align' : 'start',
				'max-width' : '400px',
				'width' : '98%',
				'margin' : 'auto',
			}
		});
		scene.add(vPanel);

		var commonLabel = {
			normal : 'Normal',
			selected : 'Selected',
			highlighted : 'Highlighted',
			disabled : 'Disabled',
		};

		var commonStyles = {
			'display' : 'block',
			'margin' : '1em 0',
			'width' : 'auto',
		};
		for ( var i = 0; i < 8; i++) {
			var hPanel = new tau.ui.Panel({
				styles : {
					'display' : '-webkit-box',
					'-webkit-box-align' : 'justify',
					'width' : '100%',
					'margin' : '10px 0',
				}
			});
			vPanel.add(hPanel);

			var styleClassType;
			if (i == 1) {
				styleClassType = 'dark';}
			else if (i === 2) {
				styleClassType = 'sanmarino';}
			else if (i === 3) {
				styleClassType = 'lochmara';}
			else if (i === 4) {
				styleClassType = 'blue';}
			else if (i === 5) {
				styleClassType = 'red';}
			else if (i === 6) {
				styleClassType = 'khaki';}
			else if (i === 7) {
				styleClassType = 'green';}
			for ( var j = 0; j < 4; j++) {
				var button = new tau.ui.Button({
					label : commonLabel,
					styles : commonStyles,
				});
				if(j == 1)
					button.setSelected(true);
				if(j == 2)
					button.setHighlighted(true);
				if(j == 3)
					button.setDisabled(true);
				if (styleClassType)
					button.setStyleClass({
						type : styleClassType
					});
				hPanel.add(button);
			}
		}
	},
});