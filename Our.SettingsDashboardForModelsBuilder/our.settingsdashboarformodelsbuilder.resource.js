(function () {
	'use strict';

	function ourSettingsDashboardForModelsBuilderResource($http, umbRequestHelper) {

		var resource = {
			getSettings: getSettings,
			postSave: postSave
		};

		var base = "Backoffice/SettingsDashboardForModelsBuilder/SettingsApi/"

		return resource;

		//////////

		function getSettings() {
			return umbRequestHelper.resourcePromise(
				$http.get(base + "getSettings"),
				"Failed to retrieve settings"
			);
		}
		
		function postSave(settings) {
			return umbRequestHelper.resourcePromise(
				$http.post(base + "PostSave", settings),
				"Failed to save settings"
			);
		}
	}

	angular.module('umbraco.resources').factory('ourSettingsDashboardForModelsBuilderResource', ourSettingsDashboardForModelsBuilderResource);

})();