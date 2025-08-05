import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import settingsService from "@/services/api/settingsService";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await settingsService.get();
      setSettings(data);
    } catch (err) {
      setError("Fout bij laden van instellingen");
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsService.update(settings);
      toast.success("Instellingen opgeslagen");
    } catch (err) {
      toast.error("Fout bij opslaan van instellingen");
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="h-full p-6">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-6">
        <Error message={error} onRetry={loadSettings} />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-secondary mb-2">
            Instellingen
          </h1>
          <p className="text-gray-600">
            Personaliseer je Notitie Hub ervaring
          </p>
        </div>

        <div className="space-y-8">
          {/* Appearance */}
          <div className="bg-surface rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name="Palette" size={20} className="text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-secondary">
                Uiterlijk
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Thema
                </label>
                <select
                  value={settings?.theme || "light"}
                  onChange={(e) => updateSetting("theme", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  <option value="light">Licht</option>
                  <option value="dark">Donker</option>
                  <option value="auto">Automatisch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Taal
                </label>
                <select
                  value={settings?.language || "nl"}
                  onChange={(e) => updateSetting("language", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  <option value="nl">Nederlands</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="bg-surface rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <ApperIcon name="Edit3" size={20} className="text-accent" />
              </div>
              <h2 className="text-lg font-semibold text-secondary">
                Editor
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Auto-opslaan interval (milliseconden)
                </label>
                <Input
                  type="number"
                  value={settings?.autoSaveInterval || 3000}
                  onChange={(e) => updateSetting("autoSaveInterval", parseInt(e.target.value))}
                  min="1000"
                  max="10000"
                  step="1000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hoe vaak notities automatisch worden opgeslagen (1000-10000ms)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Standaard map voor nieuwe notities
                </label>
                <select
                  value={settings?.defaultFolder || "2"}
                  onChange={(e) => updateSetting("defaultFolder", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  <option value="1">Werk</option>
                  <option value="2">Persoonlijk</option>
                  <option value="3">Projecten</option>
                </select>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-surface rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-success/10 rounded-lg">
                <ApperIcon name="Info" size={20} className="text-success" />
              </div>
              <h2 className="text-lg font-semibold text-secondary">
                Over Notitie Hub
              </h2>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Versie:</strong> 1.0.0
              </p>
              <p>
                <strong>Laatste update:</strong> Januari 2024
              </p>
              <p>
                Notitie Hub is een moderne Nederlandse notitie-app die je helpt 
                bij het organiseren van je gedachten en ideeën.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              variant="primary"
              disabled={saving}
            >
              {saving ? (
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              ) : (
                <ApperIcon name="Save" size={16} className="mr-2" />
              )}
              Instellingen opslaan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;