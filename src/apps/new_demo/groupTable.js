$class('tau.new_demo.GroupTable').extend(tau.ui.SceneController).define(
		{

			GroupTable : function(sectionGroup) {
				this.setTitle('GroupTable');
				this.sectionGroup = sectionGroup;
			},

			loadScene : function() {
				var scene = this.getScene();
				scene.setStyleClass({
					type: 'ios',
				});

				var table = new tau.ui.Table({
					group : true,
				});
				if(this.sectionGroup) {
					table.setStyleClass({
						section : 'sectionGroup'
					});
				}
				scene.add(table);
				for ( var i = 0; i < 100; i++) {
					var cell = new tau.ui.TableCell({
						title : 'Table Cell ' + i,
						groupName : 'Section ' + Math.floor(i / 10) + '0',
					});
					table.add(cell);
				}
			},
		});