(function () {
	"use strict";

	function ourSettingsDashboardForModelsBuilderController($scope, ourSettingsDashboardForModelsBuilderResource, notificationsService) {

		var vm = this;

		vm.save = save;


		vm.promptIsVisible = false;
		
		vm.showPrompt = showPrompt;
		vm.hidePrompt = hidePrompt;

		function showPrompt() {
			vm.promptIsVisible = true;
		}

		function hidePrompt() {
			vm.promptIsVisible = false;
		}

		function onInit() {

			vm.loading = true;
			
			ourSettingsDashboardForModelsBuilderResource.getSettings().then(function (settings) {
				vm.loading = false;
				vm.properties = settingsToProperties(settings);

			});
		}

		function save() {
			vm.buttonState = "busy";
			ourSettingsDashboardForModelsBuilderResource.postSave(propertiesToSettings(vm.properties)).then(function (settings) {
				vm.buttonState = "success";
				vm.properties = settingsToProperties(settings);
				notificationsService.success("Settings saved");
			});
		}

		function propertiesToSettings(properties)
		{
			return {
				'Umbraco_ModelsBuilder_Enable': getPropertyValue(properties, 'enable', true),
				'Umbraco_ModelsBuilder_ModelsMode': getPropertyValue(properties, 'modelsMode', 'Nothing'),
				'Umbraco_ModelsBuilder_EnableFactory': getPropertyValue(properties, 'enableFactory', true),
				'Umbraco_ModelsBuilder_ModelsNamespace': getPropertyValue(properties, 'modelsNamespace', 'Umbraco.Web.PublishedContentModels'),
				'Umbraco_ModelsBuilder_LanguageVersion': getPropertyValue(properties, 'languageVersion', 'CSharp5'),
				'Umbraco_ModelsBuilder_FlagOutOfDateModels': getPropertyValue(properties, 'flagOutOfDateModels', true),
				'Umbraco_ModelsBuilder_StaticMixinGetters': getPropertyValue(properties, 'staticMixinGetters', true),
				'Umbraco_ModelsBuilder_StaticMixinGetterPattern': getPropertyValue(properties, 'staticMixinGetterPattern', 'Get{0}'),
				'Umbraco_ModelsBuilder_ModelsDirectory': getPropertyValue(properties, 'modelsDirectory', '~/App_Data/Models'),
				'Umbraco_ModelsBuilder_AcceptUnsafeModelsDirectory': getPropertyValue(properties, 'acceptUnsafeModelsDirectory', false),
				'Umbraco_ModelsBuilder_DebugLevel': getPropertyValue(properties, 'debugLevel', 0)
			}
		}

		function getPropertyValue(properties, alias, defaultValue)
		{
			var property = properties.filter(function (p) {
				return p.alias == alias
			});

			if (property.length > 0) {
				return property[0].value;
			}
			else {
				return defaultValue;
			}
		}

		function settingsToProperties(settings)
		{
			var properties = [
				{
					label: 'Enable',
					description: 'When unchecked, the models builder behaves as if it were not installed at all, and all other settings are ignored.',
					view: 'boolean',
					alias: 'enable',
					value: settings.Umbraco_ModelsBuilder_Enable ? 'true' : 'false'
				},
				{
					label: 'Models mode',
					description: 'Determines how the models builder generates models. ',
					view: 'dropdown',
					config: {
						items:
						[
							{
								'id': 'Nothing',
								'value': 'Nothing: do not generate models'
							},
							{
								'id': 'PureLive',
								'value': 'PureLive: generate models in a dynamic in-memory assembly'
							},
							{
								'id': 'Dll',
								'value': 'Dll: generate models in a Dll in ~/bin (causes an application restart) whenever the user "clicks the button"'
							},
							{
								'id': 'LiveDll',
								'value': 'LiveDll: generate models in a Dll in ~/bin (causes an application restart) anytime a content type changes'
							},
							{
								'id': 'AppData',
								'value': 'AppData: generate models in ~/App_Data/Models(but do not compile them) whenever the user "clicks the button"'
							},
							{
								'id': 'LiveAppData',
								'value': 'LiveAppData: generate models in ~/App_Data/Models(but do not compile them) anytime a content type changes'
							}
						]
					},
					alias: 'modelsMode',
					value: settings.Umbraco_ModelsBuilder_ModelsMode
				},
				{
					label: 'Enable factory',
					description: 'Determines whether the models builder registers the built-in IPublishedContentFactory. When false, models could be generated, but would not be used by Umbraco.',
					view: 'boolean',
					alias: 'enableFactory',
					value: settings.Umbraco_ModelsBuilder_EnableFactory ? 'true' : 'false'
				},
				{
					label: 'Models namespace',
					description: 'Specifies the generated models namespace.',
					view: 'textbox',
					alias: 'modelsNamespace',
					value: settings.Umbraco_ModelsBuilder_ModelsNamespace
				},
				{
					label: 'Language version',
					description: 'Indicates the C# language version which is used when compiling the models in [Live]Dll. Can be set to CSharp6 or Experimental to try the new C# features.',
					view: 'dropdown',
					config: {
						items:
						[
							{
								'id': 'CSharp5',
								'value': 'CSharp5'
							},
							{
								'id': 'CSharp6',
								'value': 'CSharp6'
							},
							{
								'id': 'Experimental',
								'value': 'Experimental'
							}
						]
					},
					alias: 'languageVersion',
					value: settings.Umbraco_ModelsBuilder_LanguageVersion
				},
				{
					label: 'Flag out of date models',
					description: 'Indicates whether out-of-date models (ie after a content type or data type has been modified) should be flagged.',
					view: 'boolean',
					alias: 'flagOutOfDateModels',
					value: settings.Umbraco_ModelsBuilder_FlagOutOfDateModels ? 'true' : 'false'
				},
				{
					label: 'Static mixin getters',
					description: 'Indicates whether static mixin getters should be generated.',
					view: 'boolean',
					alias: 'staticMixinGetters',
					value: settings.Umbraco_ModelsBuilder_StaticMixinGetters ? 'true' : 'false'
				},
				{
					label: 'Static mixin getter pattern',
					description: 'Indicates the format of the static mixin getters.',
					view: 'textbox',
					alias: 'staticMixinGetterPattern',
					value: settings.Umbraco_ModelsBuilder_StaticMixinGetterPattern
				},
				{
					label: 'Models directory',
					description: 'Indicates where to generate models and manage all files. Has to be a virtual directory (starting with ~/) below the website root if "Accept unsafe models directory" is unchecked.',
					view: 'textbox',
					alias: 'modelsDirectory',
					value: settings.Umbraco_ModelsBuilder_ModelsDirectory
				},
				{
					label: 'Accept unsafe models directory',
					description: 'Indicates that the directory indicated in ModelsDirectory is allowed to be outside the website root (eg ~/../../some/place). Because that can be a potential security risk, it is not allowed by default.',
					view: 'boolean',
					alias: 'acceptUnsafeModelsDirectory',
					value: settings.Umbraco_ModelsBuilder_AcceptUnsafeModelsDirectory ? 'true' : 'false'
				},
				{
					label: 'Debug level',
					description: 'Indicates the debug level. For internal / development use. Set to greater than zero to enable detailed logging.',
					view: 'integer',
					alias: 'debugLevel',
					value: settings.Umbraco_ModelsBuilder_DebugLevel
				}
			];


			return properties;

		}

		onInit();

	}

	angular.module("umbraco").controller("Our.SettingsDashboardForModelsBuilder.Controller", ourSettingsDashboardForModelsBuilderController);

})();
