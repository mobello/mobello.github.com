/**
 * Theme
 */
$class('tau.demo.Theme').extend(tau.ui.SceneController).define( {
  
  loadScene: function() {
    // scene에 컴포넌트를 추가한다.
    this.getScene().add(new tau.ui.SegmentedButton({
      components: [
        {label: 'default'},
        {label: 'simple'},
        {label: 'ios'}
      ],
      vertical: true,
      valueChange: this.changeTheme,
      styles: {width: '100%'}
    })
   );
  },
  
  /**
	 * event listener, it will be notified when a user touches segmented button
	 */
  changeTheme: function (e, payload) {
	 switch (payload.selectedIndexes[0]) {
	case 0:
		tau.getRuntime().setTheme('default');
		break;
	case 1:
		tau.getRuntime().setTheme('simple');
		break;
	case 2:
		tau.getRuntime().setTheme('ios');
		break;
	case 3:
		tau.getRuntime().setTheme('bootstrap');
		break;
	}
  }
});