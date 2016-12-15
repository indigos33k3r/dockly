'use strict';

exports.widget = {};
exports.getWidget = function(blessed, screen) {
  let widget = blessed.donut({
    label: 'Container Utilization',
    radius: 10,
    arcWidth: 3,
    remainColor: 'black',
    style: {
      fg: 'blue',
      bg: 'default',
      border: {
        fg: 'default',
        bg: 'default'
      },
      selected: {
        bg: 'green'
      }
    },
    border: {
      type: 'line',
      fg: '#00ff00'
    },
    hover: {
      bg: 'blue'
    },
    width: '40%',
    height: '22%',
    top: '18%',
    left: '60%'
  });

  this.widget = widget;
  return widget;
};

exports.update = function(data) {

  if (!data || Object.keys(data).length === 0) {
    return;
  }

  // Calculate CPU usage based on delta from previous measurement
  var cpuUsageDelta = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
  var systemUsageDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
  var cpuCoresAvail = data.cpu_stats.cpu_usage.percpu_usage !== null ? data.cpu_stats.cpu_usage.percpu_usage.length : 0;

  var cpuUsagePercent = 0;
  if (systemUsageDelta != 0 || cpuCoresAvail != 0) {
    cpuUsagePercent = cpuUsageDelta / systemUsageDelta * cpuCoresAvail * 100;
  }

  // Calculate Memory usage
  var memUsage = data.memory_stats.usage;
  var memAvail = data.memory_stats.limit;

  var memUsagePercent = 0;
  if (memAvail != 0) {
    memUsagePercent = memUsage / memAvail * 100;
  }

  this.widget.setData([{
    percent: Math.round(Number(cpuUsagePercent)),
    label: 'cpu %',
    'color': 'magenta'
    }, {
      percent: Math.round(Number(memUsagePercent)),
      label: 'mem %',
      'color': 'cyan'
    }
  ]);

};