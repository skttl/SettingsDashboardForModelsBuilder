using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Configuration;
using Umbraco.Web.Editors;
using Umbraco.Web.Mvc;

namespace Our.SettingsDashboardForModelsBuilder.Core
{
	/// <summary>
	/// Summary description for VenuesController
	/// </summary> 
	[PluginController("SettingsDashboardForModelsBuilder")]
	public class SettingsApiController : UmbracoAuthorizedJsonController
	{
		[UmbracoAuthorize(Roles = "Administrator")]
		public Dictionary<string, object> PostSave(Dictionary<string, object> settings)
		{
			var config = WebConfigurationManager.OpenWebConfiguration("/");

			foreach (var setting in settings)
			{
				if (!config.AppSettings.Settings.AllKeys.Contains(setting.Key.Replace("_", ".")))
				{
					config.AppSettings.Settings.Add(setting.Key.Replace("_", "."), setting.Value.ToString());
				}
				else
				{
					config.AppSettings.Settings[setting.Key.Replace("_", ".")].Value = setting.Value.ToString();
				}
			}

			config.Save(ConfigurationSaveMode.Minimal);

			return settings;
		}

		public Dictionary<string, object> GetSettings()
		{
			var settings = new Dictionary<string, object>();

			settings.Add("Umbraco_ModelsBuilder_Enable", Convert.ToBoolean(GetAppSetting("Umbraco.ModelsBuilder.Enable", "false")));
			settings.Add("Umbraco_ModelsBuilder_ModelsMode", GetAppSetting("Umbraco.ModelsBuilder.ModelsMode", "Nothing"));
			settings.Add("Umbraco_ModelsBuilder_EnableFactory", Convert.ToBoolean(GetAppSetting("Umbraco.ModelsBuilder.EnableFactory", "true")));
			settings.Add("Umbraco_ModelsBuilder_ModelsNamespace", GetAppSetting("Umbraco.ModelsBuilder.ModelsNamespace", "Umbraco.Web.PublishedContentModels"));
			settings.Add("Umbraco_ModelsBuilder_LanguageVersion", GetAppSetting("Umbraco.ModelsBuilder.LanguageVersion", "CSharp5"));
			settings.Add("Umbraco_ModelsBuilder_FlagOutOfDateModels", Convert.ToBoolean(GetAppSetting("Umbraco.ModelsBuilder.FlagOutOfDateModels", "true")));
			settings.Add("Umbraco_ModelsBuilder_StaticMixinGetters", Convert.ToBoolean(GetAppSetting("Umbraco.ModelsBuilder.StaticMixinGetters ", "true")));
			settings.Add("Umbraco_ModelsBuilder_StaticMixinGetterPattern", GetAppSetting("Umbraco.ModelsBuilder.StaticMixinGetterPattern ", "Get{0}"));
			settings.Add("Umbraco_ModelsBuilder_ModelsDirectory", GetAppSetting("Umbraco.ModelsBuilder.ModelsDirectory ", "~/App_Data/Models"));
			settings.Add("Umbraco_ModelsBuilder_AcceptUnsafeModelsDirectory", Convert.ToBoolean(GetAppSetting("Umbraco.ModelsBuilder.AcceptUnsafeModelsDirectory ", "false")));
			settings.Add("Umbraco_ModelsBuilder_DebugLevel", Convert.ToInt32(GetAppSetting("Umbraco.ModelsBuilder.DebugLevel ", "0")));

			return settings;

		}

		private string GetAppSetting(string key, string defaultValue)
		{
			var appSettings = ConfigurationManager.AppSettings;
			return appSettings.AllKeys.Contains(key) ? appSettings[key] : defaultValue;
		}

	}
}